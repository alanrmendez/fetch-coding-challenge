const express = require('express');

function sumPoints(transactions) {
  let sum = 0;
  for (let i = 0; i < transactions.length; i++) {
    sum += transactions[i].points;
  }
  return sum;
}

function spendPoints(points, transactions) {
  let pointsToSpend = points;
  let availablePoints = sumPoints(transactions);
  if (pointsToSpend < 0) {
    const error = 'Eror: no spending negative points!';
    return error;
  } else if (pointsToSpend == 0) {
    const response = 'No points spent! Was this on purpose?';
    return response;
  } else if (pointsToSpend > availablePoints) {
    const error = 'Sorry, the number of points entered is greater than the number of points available to spend.';
    return error;
  } else {
    const payers = [];
    const payerListWithPointsSpent = [];
    transactions.sort((a, b) => {
      const firstItem = a.timestamp;
      const secondItem = b.timestamp;
      if (firstItem < secondItem) {
        return -1;
      }
      if (firstItem > secondItem) {
        return 1;
      }
      return 0;
    });    
    let newPayer = 0;
    while (pointsToSpend > 0) {
      for (let i = 0; i < transactions.length; i++) {
        newPayer = transactions[i].payer;
        const isInList = payers.includes(newPayer);
        if (isInList == false) {
          payers.push(newPayer);
          let newEntry = {"payer": newPayer, "points": 0};
          payerListWithPointsSpent.push(newEntry);
        }
        if (pointsToSpend >= transactions[i].points) {
          pointsToSpend -= transactions[i].points;
          for (let j = 0; j < payerListWithPointsSpent.length; j++) {
            if (payerListWithPointsSpent[j].payer == newPayer) {
              payerListWithPointsSpent[j].points -= transactions[i].points;
            }
          }
          transactions[i].points = 0;
          if (pointsToSpend == 0) {
            break;
          }
        } else { 
          transactions[i].points -= pointsToSpend;
          for (let j = 0; j < payerListWithPointsSpent.length; j++) {
            if (payerListWithPointsSpent[j].payer == newPayer) {
              payerListWithPointsSpent[j].points -= pointsToSpend;
            }
          }
          pointsToSpend = 0;
          break;
        }
      }
    }
    return payerListWithPointsSpent;
  }
}

function pointsBalance(transactions) {
  const payers = [];
  const balances = [];
  if (transactions.length == 0) {
    const result = 'You don\'t have any available points.';
    return result;
  } else {
    for (let i = 0; i < transactions.length; i++) {
      let newPayer = transactions[i].payer;
      let pointsToAdd = transactions[i].points;
      const isInList = payers.includes(newPayer);
      if (isInList == false) {
        payers.push(newPayer);
        let newEntry = {"payer": newPayer, "points": 0};
        balances.push(newEntry);
      }
      for (let j = 0; j < balances.length; j++) {
        if (balances[j].payer == newPayer) {
          balances[j].points += pointsToAdd;
        }
      }
    }
  }
  return balances;
}

module.exports.spendPoints = spendPoints;
module.exports.pointsBalance = pointsBalance;
