const path = require('path')
const fs  = require('fs')
const zlib = require('zlib')
class LsTreeCommand {
  constructor(flag, sha) {
    this.flag = flag;
    this.sha = sha;
  }

  execute() {
    const flag = this.flag;
    const sha = this.sha;
    const folder = sha.slice(0, 2);
    const file = sha.slice(2);
    const folderPath = path.join(process.cwd(), '.git', 'objects', folder);
    const filePath = path.join(folderPath, file);

    console.log(`Checking object: ${sha}`);
    console.log(`Folder path: ${folderPath}`);
    console.log(`File path: ${filePath}`);

    if (!fs.existsSync(folderPath)) {
      throw new Error(`Error: No such directory - ${folderPath}`);
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Error: No such file - ${filePath}`);
    }

    try {
      const fileContent = fs.readFileSync(filePath);
      const outputBuffer = zlib.inflateSync(fileContent);
      const output = outputBuffer.toString().split("\0");
      const treeContent  = output.slice(1).filter((e)=> e.includes(""))
      const name  = treeContent.map((e)=> e.split(" ")[1]);
      for(const n of name)
      {
        console.log(n)
      }
      console.log('Object content:', name);

    //   return output;
    } catch (err) {
      console.error('Error reading object file:', err);
      throw err;
    }
  }
}

module.exports = LsTreeCommand;