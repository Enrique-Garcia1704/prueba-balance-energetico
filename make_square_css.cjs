const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', '..', 'Desktop', 'Pruebadetrabajo3', 'src');

function replaceBorderRadius(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceBorderRadius(fullPath);
    } else if (fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const newContent = content.replace(/border-radius:\s*[^;]+;/g, 'border-radius: 0;');
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated CSS ${fullPath}`);
      }
    } else if (fullPath.endsWith('CaloriesChart.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const newContent = content.replace(/radius={\[.*?\]}/g, 'radius={[0, 0, 0, 0]}');
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated TSX ${fullPath}`);
      }
    }
  }
}

replaceBorderRadius(srcDir);
console.log("Done making everything perfectly square in CSS and Recharts.");
