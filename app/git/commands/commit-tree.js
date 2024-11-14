const path = require("path")
const zlib = require("zlib")
const fs = require("fs")
const crypto = require("crypto")

class CommitTreeCommand {
    constructor(tree,parent,message){
        this.treeSHA = tree
        this.parentSHA= parent
        this.message = message
    }

    execute(){
        const commitContentBuffer = Buffer.concat([
            Buffer.from(`tree ${this.treeSHA}\n`),
            Buffer.from(`parent ${this.parentSHA}`),
            Buffer.from(`author pratik nikat <pratiknikat07@gmail.com> ${Date.now()} +0000 \n\n`),
            Buffer.from(`Commiter pratik nikat <pratiknikat07@gmail.com> ${Date.now()} +0000 \n\n`),
            Buffer.from(this.message + "\n")

        ]);
        const header = `commit ${commitContentBuffer.length}\0`;
        const data = Buffer.concat([Buffer.from(header),commitContentBuffer])

        const hash = crypto.createHash("sha1").update(data).digest("hex")

        const folder = hash.slice(0, 2);
        const file = hash.slice(2);
        const completeFolderPath = path.join(process.cwd(), '.git', 'objects', folder);
        
        if (!fs.existsSync(completeFolderPath)) 
          fs.mkdirSync(completeFolderPath);
  
        // Compression
        const compressedData = zlib.deflateSync(blob);
        fs.writeFileSync(
          path.join(completeFolderPath, file),
          compressedData
        );

        console.log(hash)

    }
}

module.exports = CommitTreeCommand