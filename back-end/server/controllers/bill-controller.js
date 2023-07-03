const config = require("../../config.json");
const dbConfig = require("../../my-sql-connection");
const fs = require('fs');
const path = require('path');

exports.downloadImage = function (req, res, next) {
    const fileData = (req.body.fileData.split(","))[1];
    const name = req.body.name;

    // Save the file to the 'img' folder
    const parentDirectoryPath = path.resolve(__dirname, '..');
    const folderPath = path.join(parentDirectoryPath, 'bills');
    const fileName = name; 
    const filePath = path.join(folderPath, fileName);

    // Decode the base64 data and save it to the file
    const decodedData = Buffer.from(fileData, 'base64');
    fs.writeFileSync(filePath, decodedData);
    console.log("saved png successfully");
    return res.status(200).send({
        success: true,
        message: "Bill saved successfully"
      });
};