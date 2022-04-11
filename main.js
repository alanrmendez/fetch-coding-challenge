//const cors = require('cors');


function resetElement(element) {
  document.getElementById(element).value = "";
}

function resetError() {
  document.getElementById("pointsErr").innerHTML = "";
}

// Information to reach API
const url = 'http://localhost:3000';
const payerQueryParams = '?payer=';
const pointsQueryParams = '&points=';
const timestampQueryParams = '&timestamp=';
const spendQueryParams = '?points=';

// Select page elements
let payerInput = document.getElementById('payer');
let pointsInput = document.getElementById('points');
let timestampInput = document.getElementById('timestamp');
let transactionConfirmation = document.getElementById('transaction-confirmation');
let pointsToSpend = document.getElementById('points-to-spend');
let pointsSpentPerPayer = document.getElementById('points-spent-per-payer');
const transactionButton = document.getElementById('transaction-button');
const spendButton = document.getElementById('spend-points');
const balancesButton = document.getElementById('view-balances');
const balancesResponse = document.getElementById('balances');



const addTransaction = async () => {
  const payerQuery = payerInput.value;
  const pointsQuery = pointsInput.value;
  const timestampQuery = timestampInput.value;
  console.log(payerQuery, ' ', pointsQuery, ' ', timestampQuery);

  const endpoint = `${url}${payerQueryParams}${payerQuery}${pointsQueryParams}${pointsQuery}${timestampQueryParams}${timestampQuery}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        payer: payerInput,
        points: pointsInput,
        timestamp: timestampInput
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      const addedTransaction = await response.json();

      resetElement('payer');
      resetElement('points');
      resetElement('timestamp');

      transactionConfirmation.innerHTML = 'Transaction successfully added!';

      setTimeout(() => {
        transactionConfirmation.innerHTML = '';
      }, 3000);

      return addedTransaction;

    }
    throw new Error('Request failed');
  } catch (error) {
    console.log(error);
  }
}


const spendPoints = async () => {
  const pointsInput = pointsToSpend.value;
  console.log(pointsInput);
  const endpoint = `${url}${spendQueryParams}${pointsInput}`;

  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify({
        points: pointsInput
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      const pointsSpent = await response.text();
      pointsSpentPerPayer.innerHTML = pointsSpent;
      resetElement('points-to-spend');

      return;

    }
    throw new Error('Request failed');
  } catch (error) {
    console.log(error);
  }
}



const getBalances = async () => {
  const endpoint = `${url}`;
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const jsonResponse = await response.text();
      balancesResponse.innerHTML = jsonResponse;
      return;
    }
    throw new Error('Request failed');
  } catch (error) {
    console.log(error);
  }
}

//Clear previous results and display results to webpage
const viewBalances = (event) => {
  event.preventDefault();
  while (balancesResponse.firstChild) {
    balancesResponse.removeChild(balancesResponse.firstChild)
  }
  getBalances();
}

transactionButton.addEventListener('click', addTransaction);
spendButton.addEventListener('click', spendPoints);
balancesButton.addEventListener('click', viewBalances);
