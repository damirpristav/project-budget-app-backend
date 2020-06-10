const express = require('express');
const cors = require('cors');
const fs = require('fs');

const generateAndDownloadPdf = require('./pdf');

const app = express();

// Body parser
app.use(express.json());
// Cors
app.use(cors({ origin: 'https://wonderful-jackson-8900a4.netlify.app/' }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'nothing here...'
  });
});

// const dummyData = {
//   projectInfo: {
//     name: 'My Project',
//     client: 'John Doe',
//     start: '10-06-2020'
//   },
//   deliveryDate: '30-06-2020',
//   totalPrice: 5000,
//   tasks: [
//     { id: 'task-1', name: 'Task 1', days: 5, cost: 1500 },
//     { id: 'task-1', name: 'Task 2', days: 15, cost: 3500 }
//   ]
// }

app.post('/generatePdf', async (req, res) => {
  try {
    const pdf = await generateAndDownloadPdf(req.body, 'default', 'ProjectBudget');
    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf[0].length });
    res.send(pdf[0]);
    // Delete pdf file after it is sent 
    fs.unlink(`${pdf[1]}.pdf`, (err) => {
      if(err) console.log('delete err...', err);
    });
  }catch(err) {
    console.log('error...', err);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server running...'));