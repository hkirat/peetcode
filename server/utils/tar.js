const tar = require("tar");
const fs = require("fs");

// Create a tar.gz archive of a specific file
module.exports = function createTarGz(filePath, outputFilePath) {
  const tarStream = tar.c({ gzip: true }, [filePath]);
  const writeStream = fs.createWriteStream(outputFilePath);

  tarStream.pipe(writeStream);

  return new Promise((resolve, reject) => {
    tarStream.on("end", resolve);
    tarStream.on("error", reject);
    writeStream.on("error", reject);
  });
};
