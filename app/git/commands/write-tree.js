const path = require('path')
const fs = require('fs')
const crypto = require("crypto")
function writeFileBlob(currentPath){
    const contents  = fs.readFileSync(currentPath)
    const len = contents.length;

    const header = `blob ${len}\0`
    const blob = Buffer.concat([Buffer.from(header),contents])

    const hash = crypto.createHash("sha1").update(blob).digest("hex")
    const folder = hash.slice(0, 2);
    const file = hash.slice(2);
    const completeFolderPath = path.join(process.cwd(), '.git', 'objects', folder);
    if (!fs.existsSync(completeFolderPath)) 
        fs.mkdirSync(completeFolderPath);
    const compressedData = zlib.deflateSync(blob);
      fs.writeFileSync(
        path.join(completeFolderPath, file),
        compressedData
      );
    return hash;
}

class WriteTreeCommand {
    constructor(){

    }
    execute(){
        // 1. recursive reads all the files and dir 
        function recursiveCreateTree(basePath){
            const dirCintents = fs.readdirSync(basePath)
            const result = []


            for(const dirContent of dirCintents){
                if(dirContent.includes(".git")) continue;

                const currenPath = path.join(basePath, dirContent)
                const stat = fs.statSync(currenPath)
                if(stat.isDirectory()){
                    console.log(`\n${dirContent}`)
                    recursiveCreateTree(currenPath)
                }else if(stat.isFile()){
                    const sha = writeFileBlob(currenPath)
                    result.push({mode:'100644', basename:path.basename(currenPath),sha})
                    console.log(`  ${sha}`)
                }
                
            }

        }

        recursiveCreateTree(process.cwd());
        // 2. If item is dir , do it again for inner dir 
        // 3. if file create blob , write hash and file to object and write entry to tree 

    }
}

module.exports = WriteTreeCommand