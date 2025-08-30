const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'js', 'broker', 'modules', 'preorders.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix all instances of "? ." to "?."
    content = content.replace(/\?\s+\./g, '?.');

    // Fix all instances of "? ?" to "??"
    content = content.replace(/\?\s+\?/g, '??');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Fixed all optional chaining syntax errors in preorders.js');
} catch (error) {
    console.error('❌ Error fixing syntax:', error.message);
}