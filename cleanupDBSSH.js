const { Client } = require('pg');
const mongoose = require('mongoose');
const { Client: SSHClient } = require('ssh2');
const { appendToFile, getValueFromFile } = require('./utils');
const { connectToDatabaseThroughSSH, closeDBConn, pgConfig } = require('./postgreConn');
const { connectToMongoDB, closeMongoDBConn } = require('./mongoConn');
const config = require('./config');


const userEmails = ['micotef668@anwarb.com', 'yopeja8951@ociun.com', 'hilago7301@shanreto.com', 'bixag10427@amankro.com',
    'xajarop412@shanreto.com', 'xigijil116@shanreto.com', 'rixese3956@devswp.com', 'minoxow464@tiuas.com', 'fekahof178@lukaat.com',
    'depekef624@touchend.com', 'kixen23110@v1zw.com', 'dojoder416@deligy.com'];

const orgsExceptionList = [`faec3cd2-6515-41f0-b3eb-fddce953070e`, `c70688f0-2fef-49ae-8c7e-6eedb78e2c44`];

const mongoNenyaConfig = {
    host: config.mongoHost,
    port: config.mongoPort,
    database: 'nenya',
    username: config.mongoUserName,
    password: config.mongoPassword,
};

const mongoValarConfig = {
    host: config.mongoHost,
    port: config.mongoPort,
    database: 'valar',
    username: config.mongoUserName,
    password: config.mongoPassword,
};

async function getOrgIdFromDB() {
    const sshClient = new SSHClient();
    const pgClient = new Client(pgConfig);
    connectToDatabaseThroughSSH(sshClient, pgClient);
    //orgTab here is rows of data which the query returned
    for (const email of userEmails) {
        let sellerOrgIds = [], vendorOrgIds = [];
        queryStr = `SELECT _id, type FROM organizations where email = '${email}' LIMIT 10000`;
        const orgTab = await pgClient.query(queryStr);
        orgTab.rows.forEach(row => {
            if (!orgsExceptionList.includes(row._id)) {
                if (row.type === 'seller') {
                    sellerOrgIds.push(row._id);
                }
                else {
                    vendorOrgIds.push(row._id);
                }
            }
        });
        appendToFile(`SellerOrgIds.json`, `${email}Sellers`, sellerOrgIds);
        appendToFile(`VendorOgrIds.json`, `${email}Vendors`, sellerOrgIds);
    };
    closeDBConn(sshClient, pgClient);
}

async function deleteFromNenyaDB() {
    const connectionString = `mongodb://${mongoNenyaConfig.username}:${mongoNenyaConfig.password}@${mongoNenyaConfig.host}:${mongoNenyaConfig.port}/${mongoNenyaConfig.database}`;
    await connectToMongoDB(connectionString);
    let res;
    for (const email of userEmails) {
        const listOfOrgId = getValueFromFile(`SellerOrgIds.json`, `${email}Sellers`);
        for (const orgID of listOfOrgId) {
            const attrModel = mongoose.model('attributes', new mongoose.Schema({}, { strict: false }));
            res = await attrModel.deleteMany({ x_org_id: orgID });
            console.log(`Count of Attributes Deleted: ${res.deletedCount}`);
            const categoryModel = mongoose.model('attributes', new mongoose.Schema({}, { strict: false }));
            res = await categoryModel.deleteMany({ x_org_id: orgID });
            console.log(`Count of Category Deleted: ${res.deletedCount}`);
            const categoryMappingModel = mongoose.model('attributes', new mongoose.Schema({}, { strict: false }));
            res = await categoryMappingModel.deleteMany({ x_org_id: orgID });
            console.log(`Count of Category Mapping Deleted: ${res.deletedCount}`);
            const templateModel = mongoose.model('attributes', new mongoose.Schema({}, { strict: false }));
            res = await templateModel.deleteMany({ x_org_id: orgID });
            console.log(`Count of Templates Deleted: ${res.deletedCount}`);
        }
    }
    await closeMongoDBConn();
}

async function deleteFromValarDB() {
    const connectionString = `mongodb://${mongoValarConfig.username}:${mongoValarConfig.password}@${mongoValarConfig.host}:${mongoValarConfig.port}/${mongoValarConfig.database}`;
    await connectToMongoDB(connectionString);
    let res;
    for (const email of userEmails) {
        const listOfOrgId = getValueFromFile(`SellerOrgIds.json`, `${email}Sellers`);
        for (const orgIDVar of listOfOrgId) {
            const taskIdsModel = mongoose.model('taskids', new mongoose.Schema({}, { strict: false }));
            res = await taskIdsModel.deleteMany({ org: orgIDVar });
            console.log(`Count of Task Ids Deleted: ${res.deletedCount}`);
            const taskProductsModel = mongoose.model('task_products', new mongoose.Schema({}, { strict: false }));
            res = await taskProductsModel.deleteMany({ brand_org: orgIDVar });
            console.log(`Count of task Products Deleted: ${res.deletedCount}`);
            const relationshipConfigsModel = mongoose.model('relationship_configs', new mongoose.Schema({}, { strict: false }));
            res = await relationshipConfigsModel.deleteMany({ x_org_id: orgIDVar });
            console.log(`Count of Relationship Configs Deleted: ${res.deletedCount}`);
            const relationshipExportsModel = mongoose.model('relationship_exports', new mongoose.Schema({}, { strict: false }));
            res = await relationshipExportsModel.deleteMany({ org_id: orgIDVar });
            console.log(`Count of Relationship Exports Deleted: ${res.deletedCount}`);
            const relationshipMappingBulkModel = mongoose.model('relationship_mapping_bulks', new mongoose.Schema({}, { strict: false }));
            res = await relationshipMappingBulkModel.deleteMany({ org_id: orgIDVar });
            console.log(`Count of Relationship Mapping Bulk Deleted: ${res.deletedCount}`);
            const relationshipsModel = mongoose.model('relationships', new mongoose.Schema({}, { strict: false }));
            res = await relationshipsModel.deleteMany({ x_org_id: orgIDVar });
            console.log(`Count of Relationships Deleted: ${res.deletedCount}`);
            const productMappingsModel = mongoose.model('product_mappings', new mongoose.Schema({}, { strict: false }));
            res = await productMappingsModel.deleteMany({ brand_org: orgIDVar });
            console.log(`Count of Product Mappings Deleted: ${res.deletedCount}`);
            const masterProductsModel = mongoose.model('master_products', new mongoose.Schema({}, { strict: false }));
            res = await masterProductsModel.deleteMany({ brand_org: orgIDVar });
            console.log(`Count of Master Products Deleted: ${res.deletedCount}`);
            const enrichmentProductsModel = mongoose.model('enrichment_products', new mongoose.Schema({}, { strict: false }));
            res = await enrichmentProductsModel.deleteMany({ brand_org: orgIDVar });
            console.log(`Count of Enrichment Products Deleted: ${res.deletedCount}`);
            const commentsModel = mongoose.model('comments', new mongoose.Schema({}, { strict: false }));
            res = await commentsModel.deleteMany({ sender_org: orgIDVar });
            console.log(`Count of comments Deleted: ${res.deletedCount}`);
            const changeLogModel = mongoose.model('change_logs', new mongoose.Schema({}, { strict: false }));
            res = await changeLogModel.deleteMany({ orgId: orgIDVar });
            console.log(`Count of change log Deleted: ${res.deletedCount}`);
            const assetsModel = mongoose.model('assets', new mongoose.Schema({}, { strict: false }));
            res = await assetsModel.deleteMany({ org_id: orgIDVar });
            console.log(`Count of assets Deleted: ${res.deletedCount}`);
            const jobsModel = mongoose.model('jobs', new mongoose.Schema({}, { strict: false }));
            res = await jobsModel.deleteMany({ brand_id: orgIDVar });
            console.log(`Count of jobs Deleted: ${res.deletedCount}`);
        }
    }
    await closeMongoDBConn();
}

async function deleteFromPGDB() {
    const sshClient = new SSHClient();
    const pgClient = new Client(pgConfig);
    let res;
    connectToDatabaseThroughSSH(sshClient, pgClient);
    for (const email of userEmails) {
        const listOfOrgId = getValueFromFile(`SellerOrgIds.json`, `${email}Sellers`);
        for (const orgID of listOfOrgId) {
            queryStr = `Delete from inviteMember where orgId = '${orgID}'`;
            res = await pgClient.query(queryStr);
            console.log(`Count of Members Deleted: ${res.rowCount}`);
            queryStr = `Delete from teams where orgId = '${orgID}'`;
            res = await pgClient.query(queryStr);
            console.log(`Count of Teams Deleted: ${res.rowCount}`);
            queryStr = `Delete from userGroupMapping where orgId = '${orgID}'`;
            res = await pgClient.query(queryStr);
            console.log(`Count of User Group Mapping Deleted: ${res.rowCount}`);
            queryStr = `Delete from userGroups where orgId = '${orgID}'`;
            res = await pgClient.query(queryStr);
            console.log(`Count of user Groups Deleted: ${res.rowCount}`);
            queryStr = `Delete from vendorSellerMapping where sellerId = '${orgID}'`;
            res = await pgClient.query(queryStr);
            console.log(`Count of vendor seller mapping Deleted: ${res.rowCount}`);
            queryStr = `Delete from organizations where _id = '${orgID}'`;
            res = await pgClient.query(queryStr);
            console.log(`Count of Organizations Deleted: ${res.rowCount}`);
        }
    }
    for (const email of userEmails) {
        const listOfOrgId = getValueFromFile(`VendorOgrIds.json`, `${email}Vendors`);
        for (const orgID of listOfOrgId) {
            queryStr = `Delete from organizations where _id = '${orgID}'`;
            res = await pgClient.query(queryStr);
            console.log(`Count of Vendors Deleted: ${res.rowCount}`);
        }
    }
}

getOrgIdFromDB();
/*deleteFromValarDB();
deleteFromNenyaDB();
deleteFromPGDB();*/