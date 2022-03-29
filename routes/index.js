/* We want to have a file that handles the HTTP requests from the web service.
 * Per the prompt, these requirements include: 
 * - Track points per payer (the company/business that a user made a purchase from)
 * - record payer (string)
 * - record points (integer)
 * - record timestamp (date)
 *
 * Specifically, we want to provide routes that:
 * 1. add transactions for a specific payer and date
 * 2. spend points by oldest transaction timestamp, with no payer's points going negative
 * 3. return all payer point balances
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Transactions array with dummy content
const transactions = [{
  "payer": "DANNON",
  "points": 1000,
  "timestamp": "2020-11-02T14:00:00Z" 
  }
];

//Create transaction object
function Transaction(payer, points, timestamp) {
  this.payer = payer;
  this.points = points;
  this.timestamp = timestamp;
}


// Add transactions for a specific payer and date
app.post('/', (req, res, next) => {
  // Request should have a query object that includes payer, points, and timestamp.

  // Convert points and timestamp to their appropriate types.
  let points = parseInt(req.query.points);
  let timestamp = new Date(req.query.timestamp);

  const transaction = new Transaction(req.query.payer, points, timestamp);

  transactions.push(transaction);
  res.send(transaction);
});


// Spend points and return all payer point balances
// 




app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})