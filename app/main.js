const fs = require("fs");
const path = require("path");
const GitClient = require('./git/client');
const { CatFileCommand } = require("./git/commands/cat-file");
const { HashObjectCommand,LsTreeCommand,WriteTreeCommand,CommitTreeCommand } = require("./git/commands");

console.error("Logs from your program will appear here!");

const gitClient = new GitClient();
const command = process.argv[2];

switch (command) {
    case "init":
        createGitDirectory();
        break;
    case "cat-file":
        handleCatFileCommand();
        break;
    case "hash-object":
        handleHashObjectCommand();
        break;
    case "ls-tree":
        handleLsTreeCommand();
        break;
    case "write-tree":
        handleWriteTreeCommand();
        break;
    case "commit-tree":
        handleCommitTreeCommand();
        break;
    default:
        throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
    fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
    fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
    fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
    console.log("Initialized git directory");
}

function handleCatFileCommand() {
    const flag = process.argv[3];
    const commitSHA = process.argv[4];
    const command = new CatFileCommand({ flag, commitSHA });
    gitClient.run(command);
}


// function handleHashObjectCommand(){
//   // node app/main.js hash-object yre       
//   //  node app/main.js hash-object -w ueruuwe
//   let flag = process.argv[3];
//   let filepath = process.argv[4];
//   if(!filepath)
//   {
//     flag = null;
//     filepath = flag
//   }
//   const command = new HashObjectCommand(flag,filepath)
//   gitClient.run(command)
//   console.log({flag,filepath})
// }

function handleHashObjectCommand() {
    let flag = null;
    let filepath = null;
    
    // Check if we have a flag (-w)
    if (process.argv[3] === '-w') {
      flag = '-w';
      filepath = process.argv[4];
    } else {
      filepath = process.argv[3];
    }
    
    if (!filepath) {
      throw new Error('File path is required');
    }
  
    const command = new HashObjectCommand(flag, filepath);
    gitClient.run(command);
}

function handleLsTreeCommand(){
   let flag = process.argv[3];
   let sha = process.argv[4];

   if(!sha && flag === "--name-only") return;

   if(!sha){
    sha = flag;
    flag=null;
   }
   const command = new LsTreeCommand(flag,sha)
   gitClient.run(command )

}
  
function handleWriteTreeCommand (){
    const command = new WriteTreeCommand()
    gitClient.run(command)
}

function handleCommitTreeCommand (){
    const sha = process.argv[3]
    const commitSHA = process.argv[5]
    const commitMessage = process.argv[7]
    const command = new CommitTreeCommand(sha,commitSHA,commitMessage)

    gitClient.run(command)
}