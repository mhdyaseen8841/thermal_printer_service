// printer.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ESC = '\x1B';
const GS = '\x1D';
const CUT = GS + 'V' + '\x41' + '\x03'; // Full cut with feed

const printerName = '\\\\localhost\\RP3160 GOLD(U) 1';

function generateContent({ system, employeeId, name, menu, date }) {
  const ESC = '\x1B';
  const GS = '\x1D';
  const CUT = GS + 'V' + '\x41' + '\x03'; // Full cut with feed
  const CENTER = ESC + 'a' + '\x01';      // ESC a 1 → center alignment
  const LEFT = ESC + 'a' + '\x00';        // ESC a 0 → left alignment

  return (
    CENTER +
    'Synthite Industries Limited\n' +
    'Canteen Pass\n' +
    '-------------------------------\n' +
    LEFT +
    `System : ${system}\n` +
    `Employee ID : ${employeeId}\n` +
    `Name        : ${name}\n` +
    `Menu        : ${menu}\n` +
    `Date        : ${date}\n` +
    '-------------------------------\n\n' +
    CUT
  );
}


function printReceipt(data, cb) {
  const content = generateContent(data);
  const filePath = path.resolve(__dirname, `receipt-${Date.now()}.txt`);
  fs.writeFileSync(filePath, content, 'binary');

  exec(`print /D:"${printerName}" "${filePath}"`, (error, stdout, stderr) => {
    fs.unlink(filePath, () => {}); // optional cleanup
    cb(error, stdout, stderr);
  });
}

module.exports = { printReceipt };
