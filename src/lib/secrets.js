const { SSMClient, GetParameterCommand } =  require("@aws-sdk/client-ssm");
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

module.exports = { getDbUrl };