const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json())


// array for inputs
const submissionOptions = [
    "#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << 100;\n}",
    "#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << 200;\n}",
    "#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << 200\n}",
    "#include <iostream>\n#include <cstdlib>\n#include <unistd.h>\nusing namespace std;\n\nint main() {\n\tsleep(10);\n\tcout << 100;\n}"];

// arrray for questions
const questionsLimit = 2;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

async function codeEval(call) {
    const qno = getRandomInt(1, questionsLimit + 1);
    const sub = getRandomInt(0, 4);

    const response = await fetch(`http://localhost:30001/submission`, {
        method: "POST",
        headers: {
            authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg0MzIwODQ4fQ.nVMC5CNi4pX25ygnBWXaZ1gxWMJSzO-nwD00Updk4Ac",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            problemId: qno,
            submission: submissionOptions[sub]
        }),
    });

    console.log("\n\n\nEnding for: ", call);
    console.log("Question number: ", qno)
    console.log("Submission: ", sub);
    const json = await response.json();
    console.log(json);
    return json
}

async function callNTimes(calls) {
    return await Promise.all(calls.map(call => codeEval(call)))
}


app.post('/stress', async (req, res) => {
    const numTimes = parseInt(req.body.number);
    console.log("Number of time: ", numTimes);

    const arr = [];
    for (let i = 0; i < numTimes; i++) {
        arr.push(i);
    }

    callNTimes(arr).then(result => {
        res.send({ success: true, result: result });
    }).catch(e => {
        res.send({ success: false, error: e });
    });
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});
