const express = require('express');
const helpers = express();


//Determine the total number of rewards points the user has available to spend
function sumPoints(transactions) {
  let sum = 0;
  for (let i = 0; i < transactions.length; i++) {
    sum += transactions[i].points;
  }
  return sum;
}


//spendPoints function --> spend points using the given rules (oldest points spent first, no payer's points can go negative)
function spendPoints(points, transactions) {

  let pointsToSpend = points;
  let availablePoints = sumPoints(transactions);

  if (pointsToSpend < 0) {
    console.log('Eror: no spending negative points!');
    return;
  } else if (pointsToSpend == 0) {
    console.log('No points spent! Was this on purpose?');
    return;
  } else if (pointsToSpend > availablePoints) {
    console.log('Sorry, the number of points entered is greater than the number of points available to spend.');
    return;
  }
  else {

    // Create a list of payers as we go through each transaction
    const payers = [];
    const payerListWithPointsSpent = [];

    const sortedTransactions = transactions.sort((a, b) => a.timestamp - b.timestamp);
    // Note: adding slice() before sort() would create a clone of the transactions array,
    // which will be useful in the future if we want to have a standing ledger.

    while (pointsToSpend > 0) {

      // If the number of points to spend is greater than the points in the oldest transaction:
      if (pointsToSpend >= sortedTransactions[0].points) {
        pointsToSpend -= sortedTransactions[0].points;

        // Add payer to payer array and list if they aren't already in it
        const isInList = payers.includes(sortedTransactions[0].payer);
        if (isInList == false) {
          let newPayer = sortedTransactions[0].payer;
          payers.push(newPayer);
          let newEntry = {"payer": newPayer, "points": 0};
          payerListWithPointsSpent.push(newEntry);
        }

        // Find the appropriate payer in the list and subtract the number of points spent
        for (let i = 0; i < payerListWithPointsSpent.length; i++) {
          if (newPayer == payerListWithPointsSpent[i].payer) {
            payerListWithPointsSpent[i].points -= sortedTransactions[0].points;
          }
        }

        // Delete the oldest transaction (first in the array)
        sortedTransactions.shift();

        if (pointsToSpend == 0) {
          break;
        }

      } else { 

        // If the number of points to spend is less than the points in the oldest transaction
        sortedTransactions[0].points -= pointsToSpend;

        // Find the appropriate payer in the list and subtract the number of points spent
        for (let i = 0; i < payerListWithPointsSpent.length; i++) {
          if (newPayer == payerListWithPointsSpent[i].payer) {
            payerListWithPointsSpent[i].points -= pointsToSpend;
          }
        }

        pointsToSpend = 0;
      }
      
    }

    return payerListWithPointsSpent;

  }
}

module.exports = helpers;