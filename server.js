// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { printReceipt } = require('./printer');

const app = express();
const PORT = 7001;

app.use(bodyParser.json());

app.post('/print', (req, res) => {
  const { system, employeeId, name, menu, date } = req.body;

  if (!system || !employeeId || !name || !menu || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  printReceipt({ system, employeeId, name, menu, date }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: 'Print failed', details: error.message });
    }
    return res.json({ success: true, output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`🖨️ Print server running on http://localhost:${PORT}`);
});
