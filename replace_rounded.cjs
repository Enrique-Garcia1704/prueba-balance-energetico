const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '..', 'Desktop', 'Pruebadetrabajo3', 'src', 'components');

function replaceInDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const newContent = content.replace(/rounded-(xl|lg|full|2xl|3xl)/g, 'rounded-md');
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(dir);
console.log("Done replacing rounded classes.");
