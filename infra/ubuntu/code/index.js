const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

async function sendRequests(numberOfRequests) {
  const requests = [];

  let data = JSON.stringify({
    problemId: 1,
    submission: "#include<iostream>\nusing namespace std;\nint main() {\ncout<<200;\n}",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "peet-server-cluster-ip:3000/submission",
    headers: {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjgzOTY5NDU3fQ.uqEJNSMSECbcQNxljYxVlGKxJeojblc9TWOnqE3bU3w",
      "Content-Type": "application/json",
    },
    data: data,
  };

  for (let i = 0; i < numberOfRequests; i++) {
    requests.push(axios.request(config));
  }

  try {
    const responses = await Promise.all(requests);
    return "All requests completed:";
  } catch (error) {
    return `Error: ${error}`;
  }
}

app.post("/stress", async (req, res) => {
  Promise.all(promises)
    .then((responses) => {
      // Handle the responses
      console.log("Responses:", responses);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
    });
  res.send("Ok");
  const number = req.body.number;
  const hmm = await sendRequests(number);
  res.send(hmm);
});

app.get("/", (req, res) => {
  res.send("Healthy");
});

app.listen(3000, () => {
  console.log("Node is on ubuntu on port 3000");
});
