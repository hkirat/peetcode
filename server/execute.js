const Docker = require("dockerode");
const fs = require("fs");
const createTarGz = require("./utils/tar.js");
const DOCKER_IMAGE = require("./utils/constants.js");

const docker = new Docker();

async function executeCommand(command, container) {
  // creating the command and listening to the stream
  let exec = await container.exec({ Cmd: command, AttachStdout: true, AttachStderr: true });
  const stream = await exec.start();

  return await new Promise((resolve, reject) => {
    let output = "";

    // Capture the output from the container
    stream.on("data", (chunk) => {
      output += chunk.toString().trim();
    });

    // Handle the completion of the execution
    stream.on("end", async () => {
      resolve(output.trim());
    });

    // Handle any errors that occur during execution
    stream.on("error", (err) => {
      reject(err);
    });
  });
}

async function getContainer(container, newlyCreatedContainers) {
  const containers = await docker.listContainers({ all: true });
  let id = -1;
  for (var i = 0; i < containers.length; i++) {
    if (containers[i].Image === DOCKER_IMAGE && !containers[i].State.includes("running")) {
      id = containers[i].Id;
      container = docker.getContainer(containers[i].Id);
      break;
    }
    i++;
  }

  // if not, we create a new container
  if (!container) {
    container = await docker.createContainer({
      Image: DOCKER_IMAGE,
      Tty: false,
    });
    id = container.id;
    newlyCreatedContainers.push(container.id);
  }

  console.log("The ID of the container is: ", id);
  return container;
}

async function executeCode(submission, filename) {
  let container;
  console.log("Submission is: ", submission);
  console.log("File name is: ", filename);

  // writing the file
  fs.writeFileSync(`./submission/${filename}.cpp`, submission);
  createTarGz(`./submission/${filename}.cpp`, `./submission/${filename}.tar.gz`)
    .then(() => {
      console.log("Tar.gz archive created");
    })
    .catch((error) => {
      throw new Error("Error creating tar.gz archive:", error);
    });

  // maintaining the list of newly created containers so that we can delete them once the load goes down
  let newlyCreatedContainers = [];

  try {
    container = await getContainer(container, newlyCreatedContainers);
    await container.start();

    // Copy the user's code into the container
    await container.putArchive(`./submission/${filename}.tar.gz`, { path: "/app" });

    // deleting the files from server after it has been copied over to the container
    fs.unlinkSync(`./submission/${filename}.cpp`);
    fs.unlinkSync(`./submission/${filename}.tar.gz`);

    // Execute the code inside the container
    const execCommand = [
      "sh",
      "-c",
      `g++ -o main ./submission/${filename}.cpp && RESULT=$(./main) && ./main`,
    ];
    const output = await executeCommand(execCommand, container);

    // if the output contains error, we just return it
    if (output.includes("error")) {
      console.log("error in the output");
      return output;
    }

    // parsing the output to remove extra ASCII characters
    // DISCLAIMER: For now, we are assuming that the outputs are ONLY numbers
    let actualOutput = "";
    for (var itr = 0; itr < output.length; itr++) {
      if (output[itr] >= "0" && output[itr] <= "9") actualOutput += output[itr];
    }
    actualOutput = parseInt(actualOutput);

    // validating the answer returned by the program
    const validateCommand = [
      "sh",
      "-c",
      `curl --location 'http://localhost:3000/validate' --header 'Content-type: application/json' --data '{"question": 1,  "solution": ${actualOutput}}'`,
    ];
    const result = await executeCommand(validateCommand, container);

    let status = false;
    if (result.includes("true")) status = true;
    return status;
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    await container.stop({ force: true });

    // deleting the newly created container
    const index = newlyCreatedContainers.indexOf(container.id);
    if (index != -1) {
      // means this container was newly created
      newlyCreatedContainers.splice(index, 1);
      await container.remove();
    }
  }
}

module.exports = async function beginExecution(submission) {
  // random file name for each submission to prevent race conditions
  const filename = Math.floor(Math.random() * 1000);

  const result = await executeCode(submission, filename)
    .then(async (output) => {
      if (typeof output === "string" && output.includes("error")) {
        return {
          status: false,
          message: "Error in executing your code",
          error: output,
        };
      }

      if (output) {
        return {
          status: true,
          message: "test cases passed!",
        };
      } else {
        return {
          status: false,
          message: "test cases failed!",
        };
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return result;
};
