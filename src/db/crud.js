const { eq, desc } = require("drizzle-orm");
const clients = require("./clients");
const schemas = require("./schemas");
async function newLead({email}) {
    const db = await clients.getDrizzleDbClient();
    const result = await db.insert(schemas.LeadTable).values({
        email: email,
    }).returning();
    if (result.length === 1) {
        return result[0];
    }
    return result;
}

async function listLeads() {
    const db = await clients.getDrizzleDbClient();
    const result = await db.select().from(schemas.LeadTable)
    .orderBy(desc(schemas.LeadTable.createdAt)).limit(10);
    return result;
}

async function getLead(id) {
    //const filter = eq(schemas.LeadTable.id, id)
    const db = await clients.getDrizzleDbClient();
    const result = await db.select().from(schemas.LeadTable)
    .where(eq(schemas.LeadTable.id, id));
    if (result.length === 1) {
        return result[0];
    }
    return null;
}

module.exports = {
    newLead, 
    listLeads,
    getLead,
};