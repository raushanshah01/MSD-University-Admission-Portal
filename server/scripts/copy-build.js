const fs = require('fs');
const path = require('path');

// Paths
const clientDistPath = path.join(__dirname, '../../client/dist');
const serverPublicPath = path.join(__dirname, '../public');

console.log('📦 Starting build copy process...');
console.log('Source:', clientDistPath);
console.log('Destination:', serverPublicPath);

// Check if dist folder exists
if (!fs.existsSync(clientDistPath)) {
  console.error('❌ Error: Client dist folder not found!');
  console.error('Please run "npm run build" in the client folder first.');
  process.exit(1);
}

// Remove existing public folder if it exists
if (fs.existsSync(serverPublicPath)) {
  console.log('🗑️  Removing old public folder...');
  fs.rmSync(serverPublicPath, { recursive: true, force: true });
}

// Copy dist to public
console.log('📋 Copying build files...');
copyFolderRecursiveSync(clientDistPath, path.dirname(serverPublicPath));

// Rename dist to public
fs.renameSync(path.join(path.dirname(serverPublicPath), 'dist'), serverPublicPath);

console.log('✅ Client build successfully copied to server/public');

// Recursive copy function
function copyFolderRecursiveSync(source, targetDir) {
  const targetFolder = path.join(targetDir, path.basename(source));
  
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        fs.copyFileSync(curSource, path.join(targetFolder, file));
      }
    });
  }
}
