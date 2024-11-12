const path = require('path');
const zlib = require('zlib');
const fs = require('fs');
const crypto = require('crypto');

class HashObjectCommand {
  constructor(flag, filepath) {
    this.flag = flag;
    this.filepath = filepath;
  }

  execute() {
    // 1. Make sure that file exists
    const filepath = path.resolve(this.filepath);
    if (!fs.existsSync(filepath)) {
      throw new Error(`could not open ${filepath} for reading: No such file or directory`);
    }

    // 2. Read the file
    const fileContents = fs.readFileSync(filepath);
    const fileLength = fileContents.length;

    // 3. Create blob file
    const header = `blob ${fileLength}\0`;
    const blob = Buffer.concat([Buffer.from(header), fileContents]);

    // 4. Calculate hash
    const hash = crypto.createHash("sha1").update(blob).digest("hex");

    // 5. If -w flag is present, write the compressed file
    if (this.flag && this.flag === "-w") {
      const folder = hash.slice(0, 2);
      const file = hash.slice(2);
      const completeFolderPath = path.join(process.cwd(), 'test-dir', 'objects', folder);
      
      if (!fs.existsSync(completeFolderPath)) 
        fs.mkdirSync(completeFolderPath);

      // Compression
      const compressedData = zlib.deflateSync(blob);
      fs.writeFileSync(
        path.join(completeFolderPath, file),
        compressedData
      );
    }

    // Always output the hash
    console.log(hash);
  }
}

module.exports = HashObjectCommand;