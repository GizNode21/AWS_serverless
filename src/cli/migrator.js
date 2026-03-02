// tsx src/cli/migrator.js
const { drizzle } = require("drizzle-orm/neon-serverless");
const { migrate } = require("drizzle-orm/postgres-js/migrator")
const schema = require("../db/schemas");
const secrets = require("../lib/secrets");
require("dotenv").config();


async function performMigration() {
    const dbUrl = await secrets.getDbUrl();
    if (! dbUrl) {
        return;
    }
    //neon serverless pool
    const { Pool, neonConfig } = require("@neondatabase/serverless");
    // only do this in Node v21 and below
    const ws = require("ws");
    neonConfig.webSocketConstructor = ws;

    const pool = new Pool({ connectionString: dbUrl });
    pool.on('error', (err) => console.error(err)); // deal with e.g. re-connect
    // ...

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const db = await drizzle(client, {schema});
        await migrate(db, {migrationsFolder: "src/migrations"})
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }

    // ...
    await pool.end();
    }

if (require.main === module) {
    console.log("run this!");
    console.log(process.env.AWS_ACCESS_KEY_ID);
    performMigration().then((val) => {
        console.log("Migrations complete");
        process.exit(0);
    }).catch(err => {
        console.log(err);
        console.log("Migrations error");
        process.exit(1)
    });
}