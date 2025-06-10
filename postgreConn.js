const config = require('./config');

const sshConfig = {
    host: config.sshConfigHost,
    port: config.sshConfigPort, // Default SSH port
    username: config.sshConfigUsername,
    privateKey: require('fs').readFileSync('sshKey/ssh_key.fynd'),
};

const pgConfig = {
    user: config.pgConfigUsername,
    //connecting through ssh tunneling using localhost and port 5431 instead of host ip and port 5432
    host: `localhost`,
    database: config.pgConfigDatabase,
    password: config.pgConfigPassword,
    port: config.pgConfigPort
}

async function connectToDatabaseThroughSSH(sshClient, pgClient) {
    sshClient.connect(sshConfig);
    sshClient.on('ready', async () => {
        console.log('SSH connection established');
        try {
            await pgClient.connect();
            console.log('Connected to PostgreSQL through SSH');
            // Close the PostgreSQL client
        } catch (err) {
            console.error('Error connecting to PostgreSQL: avi', err);
        }
    });
}

async function closeDBConn(sshClient, pgClient) {
    await pgClient.end();
    console.log('PostgreSQL connection closed');
    sshClient.end();
}

module.exports = {
    connectToDatabaseThroughSSH, closeDBConn, pgConfig, sshConfig
};