const { SSMClient, GetParameterCommand, PutParameterCommand} =  require("@aws-sdk/client-ssm");
const AWS_REGION = "us-east-2"
const STAGE = process.env.STAGE || "prod";
const client = new SSMClient({region: AWS_REGION});



async function getDbUrl() {
  // http connection
  // non-pooling
  /*const paramStoreData = await ssm.getParameter({
    Name: DATABASE_URL_SSM_PARAM,
    WithDecryption: true
  }, 30 * 1000).promise();*/
  // const dbUrl = ??
  const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`;
  try {
    const paramStoreData = {
      Name: DATABASE_URL_SSM_PARAM,
      WithDecryption: true
    }
    const result = await client.send(new GetParameterCommand(paramStoreData, 30000));
    return result.Parameter.Value;
  } catch(err) {
    console.log(err);
  }
}

async function putDbUrl(stage, dbUrlValue) {
  const paramStage = stage ? stage : "dev";
  if (paramStage === "prod") {
    return;
  }
  if (! dbUrlValue) {
    return;
  }
  const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${paramStage}/database-url`;
  try {
    const paramStoreData = {
      Name: DATABASE_URL_SSM_PARAM,
      Value: dbUrlValue,
      Type: "SecureString",
      Overwrite: true,
    }
    const result = await client.send(new PutParameterCommand(paramStoreData, 30000));
    return result;
  } catch(err) {
    console.log(err);
  }
}

module.exports = { getDbUrl, 
putDbUrl };
module.exports.STAGE = STAGE; 