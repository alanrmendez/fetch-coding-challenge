function resetConfirmation() {
  document.getElementById('transaction-confirmation').innerHTML = "";
}

function resetError() {
  document.getElementById("pointsErr").innerHTML = "";
}

// Information to reach API
const url = 'http://localhost:3000';
const payerQueryParams = '?payer=';
const pointsQueryParams = '&points=';
const timestampQueryParams = '&timestamp=';

// Select page elements
const payerInput = document.getElementById('payer');
const pointsInput = document.getElementById('points');
const timestampInput = document.getElementById('timestamp');
const transactionButton = document.getElementById('transaction-button');

async function addTransaction(payerInput, pointsInput, timestampInput) {
  const payerQuery = payerInput.value;
  const pointsQuery = pointsInput;
  const timestampQuery = timestampInput;
  //console.log(payerQuery, ' ', pointsQuery, ' ', timestampQuery);

  const endpoint = `${url}${payerQueryParams}${payerQuery}${pointsQueryParams}${pointsQuery}${timestampQueryParams}${timestampQuery}`;
  console.log(endpoint);
  try {
    const response = await fetch('endpoint', {
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
    return addedTransaction;
    }
  } catch(error) {
    console.log(error);
  }
}

transactionButton.addEventListener('click', addTransaction(payerInput, pointsInput, timestampInput));
