// import convict from "convict";
//test comment
const convict = require("convict");
const _ = require("lodash");

// Define a schema for your configuration properties
const config = convict({
    sshConfigHost: {
        doc: "sshConfig Host",
        format: "String",
        default: "",
        env: "sshConfigHost",
    },
    sshConfigPort: {
        doc: "sshConfig Port",
        format: "String",
        default: "",
        env: "sshConfigPort",
    },
    sshConfigUsername: {
        doc: "sshConfig Username",
        format: "String",
        default: "",
        env: "sshConfigUsername",
    },
    pgConfigUsername: {
        doc: "pgConfig Username",
        format: "String",
        default: "",
        env: "pgConfigUsername",
    },
    pgConfigDatabase: {
        doc: "pgConfig Database",
        format: "String",
        default: "",
        env: "pgConfigDatabase",
    },
    pgConfigPassword: {
        doc: "pgConfig Password",
        format: "String",
        default: "",
        env: "pgConfigPassword",
    },
    pgConfigPort: {
        doc: "pgConfig Port",
        format: "String",
        default: "",
        env: "pgConfigPort",
    },
    mongoHost: {
        doc: "mongoDB Host",
        format: "String",
        default: "",
        env: "mongoHost",
    },
    mongoPort: {
        doc: "mongoDB Port",
        format: "String",
        default: "",
        env: "mongoPort",
    },
    mongoPort: {
        doc: "mongoDB Port",
        format: "String",
        default: "",
        env: "mongoPort",
    },
    mongoUserName: {
        doc: "mongoDB UserName",
        format: "String",
        default: "",
        env: "mongoUserName",
    },
    mongoPassword: {
        doc: "mongoDB Password",
        format: "String",
        default: "",
        env: "mongoPassword",
    },

});

// Load the configuration from environment variables
config.validate({ allowed: "strict" });
console.log(
    `Config loaded successfully: ${JSON.stringify(
        config.getProperties(),
        null,
        2
    )}`
);

_.extend(config, config.get());

module.exports = config;