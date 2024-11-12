const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

class CatFileCommand {
    constructor({ flag, commitSHA }) {
        this.flag = flag;
        this.commitSHA = commitSHA;
    }

    execute() {
        if (!this.flag || !this.commitSHA) {
            throw new Error('Flag and commit SHA are required');
        }

        switch(this.flag) {
            case "-p": {
                const folder = this.commitSHA.slice(0, 2);
                const file = this.commitSHA.slice(2);
                const completePath = path.join(process.cwd(), ".git", "objects", folder, file);
                
                if (!fs.existsSync(completePath)) {
                    throw new Error(`Not a valid commit SHA ${this.commitSHA}`);
                }
                
                const fileContents = fs.readFileSync(completePath);
                const decompressedContents = zlib.inflateSync(fileContents);
                const output = decompressedContents.toString();
                console.log(output);
                return output;
            }
            default:
                throw new Error(`Unknown flag ${this.flag}`);
        }
    }
}

module.exports = { CatFileCommand };