const fs = require('fs');
const path = require('path');

const COLORS = {
  void: '#05070D',
  indigo: '#0B1026',
  violet: '#6C4CE3',
  magenta: '#E63C8C',
  cyan: '#29E3D9',
  amber: '#FFB648',
  white: '#F5F7FF',
  slate: '#8A93B8',
  green: '#3DDC84',
};

function processFile(filePath, cssName) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find <style>{` and `}</style>
  const startTag = '<style>{`';
  const endTag = '`}</style>';
  
  let startIndex = content.indexOf(startTag);
  let endIndex = content.indexOf(endTag);
  
  if (startIndex === -1 || endIndex === -1) {
    console.log('No style tag found in', filePath);
    return;
  }
  
  let cssContent = content.substring(startIndex + startTag.length, endIndex);
  
  // Replace ${COLORS.xxx} with actual hex codes
  for (const [key, value] of Object.entries(COLORS)) {
    const regex = new RegExp(`\\$\\{COLORS\\.${key}\\}`, 'g');
    cssContent = cssContent.replace(regex, value);
  }
  
  // Save CSS file
  const cssPath = path.join(path.dirname(filePath), cssName);
  fs.writeFileSync(cssPath, cssContent);
  console.log('Saved CSS to', cssPath);
  
  // Update the original file
  const importStatement = `import './${cssName}';\n`;
  
  if (filePath.includes('MainLayout')) {
    content = importStatement + content.substring(0, startIndex) + content.substring(endIndex + endTag.length);
  } else if (filePath.includes('Home')) {
    // Replace the whole <style>{` ... `}</style> with null
    content = importStatement + content.substring(0, startIndex) + 'null' + content.substring(endIndex + endTag.length);
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Updated', filePath);
}

processFile('./src/layouts/MainLayout.jsx', 'MainLayout.css');
processFile('./src/pages/Home/index.jsx', 'Home.css');
