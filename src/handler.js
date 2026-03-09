/*Old
AWS_ACCESS_KEY_ID="AKIAXJL3NMBFFAYXIMTU"
AWS_SECRET_ACCESS_KEY="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"
*/

const serverless = require("serverless-http");
const secrets = require("./lib/secrets");
const crud = require("./db/crud");
const validators = require("./db/validators");
const { getDbClient } = require("./db/clients");
const express = require("express");
const app = express();
app.use(express.json());


app.get("/", async (req, res, next) => {
  console.log(process.env.DEBUG);
  const sql = await getDbClient();
  const now = Date.now();
  const [ dbNowResult ] = await sql`SELECT now()`;
  const delta = (dbNowResult.now.getTime() - now) / 1000;
  return res.status(200).json({
    STAGE: secrets.STAGE,
    delta: delta,
    //DEBUG: parseInt(process.env.DEBUG) === 1, 
    //DATABASE_URL: process.env.DATABASE_URL ? process.env.DATABASE_URL : "not there"
  });
});

app.get("/leads", async (req, res, next) => {
  const result = await crud.getLeads();
  return res.status(200).json({
    results: result,
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

/*app.get("/leads", async (req, res, next) => {
  const results = await crud.listLeads();
  return res.status(200).json({
    results: results,
  });
});*/

app.post("/leads", async (req, res, next) => {
  // POST -> create data
  const postData = req.body;
  const { data, hasError, message } = await validators.validateLead(postData);
  //const { email } = data;
  if (hasError === true) {
    return res.status(400).json({
      message: message ? message : "Invalid request. please try again",
    });
  } else if (hasError === undefined) {
     return res.status(500).json({
      message: "Server Error",
    });
  }
  const result = await crud.newLead(data);
  // insert data into the database
   return res.status(201).json({
      results: result,
    });
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

//app.listen(3000, () => {
//  console.log("running at http://localhost:3000")
//})
exports.handler = serverless(app);
