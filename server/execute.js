const Docker = require("dockerode");
const fs = require("fs");
const createTarGz = require("./utils/tar.js");
const DOCKER_IMAGE = require("./utils/constants.js");

const docker = new Docker();

function timeout(promise) {
  let timeoutId;
  const timeoutProise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error("timeout"));
    }, 5000);
  });

  return Promise.race([promise, timeoutProise]);
}

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

async function stopContainer(container, newlyCreatedContainers) {
  try {
    await container.stop({ force: true });
  } catch (error) {
    console.log("Error stopping container: ", error);
  }

  // deleting the newly created container
  const index = newlyCreatedContainers.indexOf(container.id);
  if (index != -1) {
    // means this container was newly created
    newlyCreatedContainers.splice(index, 1);
    await container.remove();
  }
}

async function executeCode(submission, filename, problemId) {
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
      `g++ -o main ./submission/${filename}.cpp && RESULT=$(./main) && rm ./submission/${filename}.cpp && ./main`,
    ];

    let result;
    try {
      result = await timeout(executeCommand(execCommand, container));
      // const output = await executeCommand(execCommand, container);
      console.log("Try result is: ", result);
    } catch (error) {
      console.log("Catch error async timeout");
      try {
        await container.stop({ force: true });
      } catch (error) {
        console.log("Error in stopping container: ", error);
      }
      return "error: Your code took too long to execute";
    }

    // if the output contains error, we just return it
    if (result.includes("error")) {
      console.log("error in the output");
      return result;
    }

    // parsing the output to remove extra ASCII characters
    // DISCLAIMER: For now, we are assuming that the outputs are ONLY numbers
    let actualOutput = "";
    for (var itr = 0; itr < result.length; itr++) {
      if (result[itr] >= "0" && result[itr] <= "9") actualOutput += result[itr];
    }
    actualOutput = parseInt(actualOutput);

    // validating the answer returned by the program
    const validateCommand = [
      "sh",
      "-c",
      `curl --location 'http://localhost:3000/validate' --header 'Content-type: application/json' --data '{"question": ${problemId},  "solution": ${actualOutput}}'`,
    ];
    result = await executeCommand(validateCommand, container);

    let status = false;
    if (result.includes("true")) status = true;
    return status;
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    await stopContainer(container, newlyCreatedContainers);
  }
}

module.exports = async function beginExecution(submission, problemId) {
  // random file name for each submission to prevent race conditions
  const filename = Math.floor(Math.random() * 1000);

  const result = await executeCode(submission, filename, problemId)
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
