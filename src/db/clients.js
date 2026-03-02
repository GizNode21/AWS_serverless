const { getDbUrl } = require("../lib/secrets");
const { neon, neonConfig } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
async function getDbClient() {
  try {
    const dbUrl = await getDbUrl();
    neonConfig.fetchConnectionCache = true;
    const sql = neon(dbUrl);
    return sql;
  } catch(err) {
    console.log(err);
  }
}
async function getDrizzleDbClient() {
  try {
    const sql = await getDbClient();
    return drizzle(sql);
  } catch(err) {
    console.log(err);
  }
}


module.exports = { getDbClient,
  getDrizzleDbClient
};