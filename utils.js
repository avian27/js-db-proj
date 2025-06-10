const fs = require('fs');

function appendToFile(filename, key, value) {
    let data = {};
    if (fs.existsSync(filename)) {
        const fileData = fs.readFileSync(filename, 'utf8');
        try {
            data = JSON.parse(fileData);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            return;
        }
    }
    data[key] = value;
    const jsonData = JSON.stringify(data);
    try {
        fs.writeFileSync(filename, jsonData, 'utf8');
    } catch (error) {
        console.error('Error writing data to file:', error);
    }
}

function getValueFromFile(filename, key) {
    if (!fs.existsSync(filename)) {
        console.log('File does not exist.');
        return;
    }
    const fileData = fs.readFileSync(filename, 'utf8');
    let data = {};
    try {
        data = JSON.parse(fileData);
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        return;
    }
    const value = data[key];
    if (value === undefined) {
        console.log(`Key '${key}' does not exist.`);
        return null;
    } else {
        return value;
    }
}

function getAllKeysFromFile(filename) {
    if (!fs.existsSync(filename)) {
        console.log('File does not exist.');
        return;
    }
    const fileData = fs.readFileSync(filename, 'utf8');
    let data = {};
    try {
        data = JSON.parse(fileData);
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        return [];
    }
    const keys = Object.keys(data);
    if (keys.length === 0) {
        console.log('No keys found in the file.');
        return [];
    }
    return keys;
}

module.exports = {
    appendToFile, getValueFromFile, getAllKeysFromFile
};