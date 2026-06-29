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
      
      // Replace all Tailwind rounded classes with rounded-none
      // This matches `rounded`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`,
      // as well as directional ones like `rounded-t-md`, `rounded-r-md` etc.
      const newContent = content.replace(/\brounded(?:-[a-z]+)*\b/g, 'rounded-none');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(dir);
console.log("Done making everything square.");
