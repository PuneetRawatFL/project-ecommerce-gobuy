const fs = require("fs");
const path = require("path");

const folderPath = "D:\\Project\\GoBuy\\GoBuy - users\\public\\product-images";

fs.readdir(folderPath, (err, files) => {
    if (err) return console.error("Error reading files: ", err);

    files.forEach((file) => {
        // console.log(file);
        const fullPath = path.join(folderPath, file);
        console.log(fullPath);
        const fileExtension = file.substring(file.lastIndexOf("."));
        console.log(fileExtension);
    });
});
