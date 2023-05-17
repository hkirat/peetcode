const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json())

async function codeEval(call) {
    const response = await fetch(`http://localhost:30001/submission`, {
        method: "POST",
        headers: {
            authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg0MzIwODQ4fQ.nVMC5CNi4pX25ygnBWXaZ1gxWMJSzO-nwD00Updk4Ac",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            problemId: 1,
            submission: "#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << 100\n}";,
        }),
    });

    const json = await response.json();
    console.log(json);
    return json
}

async function callNTimes(calls) {
    return await Promise.all(calls.map(call => codeEval(call)))
}

app.post('/stress', async (req, res) => {
    const numTimes = req.body
    const cleanId = 1;
    const submission = "#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << 100\n}";
    // const result = await codeEval(cleanId, submission);
    callNTimes(['sdfdsf', 'sdfsdf']).then(res => {console.log("Result: ", res)}).error(error => console.log("Error: ", error))
    res.send({ result });
})

app.listen(8080, () => {
    console.log("Listening on port 8080");
});