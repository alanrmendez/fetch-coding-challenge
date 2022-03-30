const express = require('express');
var cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { spendPoints, pointsBalance } = require('./helpers.js');
const transactions = [];

app.use(cors());

// Add transactions for a specific payer and date
app.post('/', (req, res, next) => {
  // Request should have a query object that includes payer, points, and timestamp.
  let points = parseInt(req.query.points);
  const transaction = { payer: req.query.payer, points: points, timestamp: req.query.timestamp };
  transactions.push(transaction);
  res.send(transaction);
});

// Spend points
app.put('/', (req, res, next) => {
  const pointsToSpend = req.query.points;
  const result = spendPoints(pointsToSpend, transactions);
  res.send(result);
});

// Return point balance
app.get('/', (req, res, next) => {
  const result = pointsBalance(transactions);
  res.send(result);
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
