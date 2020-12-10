const fs = require('fs');

const BondCurveLinear = fs.readFileSync(__dirname + '/../contracts/BondCurveLinear.aes', 'utf-8');
fs.writeFileSync(__dirname + '/../BondCurveLinear.aes.js', `module.exports = \`\n${BondCurveLinear.replace(/`/g, "\\`")}\`;\n`, 'utf-8');

const BondCurveLinearInterface = fs.readFileSync(__dirname + '/../contracts/BondCurveLinearInterface.aes', 'utf-8');
fs.writeFileSync(__dirname + '/../BondCurveLinearInterface.aes.js', `module.exports = \`\n${BondCurveLinearInterface.replace(/`/g, "\\`")}\`;\n`, 'utf-8');

