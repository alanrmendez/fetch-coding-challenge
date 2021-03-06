function resetConfirmation() {
    document.getElementById('transaction-confirmation').innerHTML = "";
}


function resetError() {
    document.getElementById("pointsErr").innerHTML = "";
}


//Transaction Object
function Transaction(payer, points, timestamp) {
    this.payer = payer;
    this.points = points;
    this.timestamp = new Date(timestamp);
}


//declare variables
var transactionList = [];
var payerList = [];


//addTransaction function --> add transactions for a specific payer and date, with points indicated
function addTransaction() {
    if (typeof (Storage) !== "undefined") {
        var payer = document.getElementById("payer").value;
        var points = document.getElementById("points").value;
        var timestamp = document.getElementById("timestamp").value;

        //convert variable values to appropriate data types so that they can be passed to Transaction object
        payer = payer.toUpperCase();
        points = parseInt(points);
        timestamp = new Date(timestamp + "Z");

        //check for invalid payer values
        console.log(payer);
        console.log(!payer);
        console.log(payer === "");
        if (!payer || !/\S/.test(payer)) {
            document.getElementById('transaction-confirmation').innerHTML = "Error: please input a valid payer name.";
            document.getElementById('transaction-confirmation').style.color = "darkred";
            return
        }

        //check for invalid point values
        console.log(points);
        console.log(!points);
        if (!points || !/\S/.test(points)) {
            document.getElementById('transaction-confirmation').innerHTML = "Error: please input a valid point value.";
            document.getElementById('transaction-confirmation').style.color = "darkred";
            return
        }

        //check for invalid time values
        console.log(timestamp);
        console.log(timestamp instanceof Date);
        console.log(isNaN(timestamp));
        if (!(timestamp instanceof Date) || isNaN(timestamp)) {
            document.getElementById('transaction-confirmation').innerHTML = "Error: please input a valid date and time.";
            document.getElementById('transaction-confirmation').style.color = "darkred";
            return
        }

        //add transaction entry to transaction list
        var transactionEntry = new Transaction(payer, points, timestamp);
        transactionList.push(transactionEntry);
        console.log(transactionList);
        document.getElementById("transaction-list").innerHTML = JSON.stringify(transactionList);

        //transaction confirmation message
        document.getElementById("transaction-confirmation").innerHTML = "Transaction successfully added!";
        document.getElementById('transaction-confirmation').style.color = "darkgreen";
        if (payerList.includes(payer) == false) {
            payerList.push(payer);
            console.log("New payer added to list: " + payer);
        }
        return 0;

    } else {
        alert("Sorry, storage not supported.");
        return 1;
    }
}


//sumPoints function --> determine the total number of available rewards points the user has
function sumPoints() {
    var sumPoints = 0;
    for (var i = 0; i < transactionList.length; i++) {
        sumPoints = sumPoints + transactionList[i].points;
    }
    return sumPoints;
}


//Build Object that stores payer name and points spent
function PayerListWithPointsSpent(payer, pointsSpent) {
    this.payer = payer;
    this.pointsSpent = pointsSpent;
}


//spendPoints function --> spend points using the given rules (oldest points spent first, no payer's points can go negative)
function spendPoints() {

    var numPoints = parseInt(document.getElementById("points-spend").value);
    console.log(numPoints);
    var sumPointsTest = sumPoints();
    console.log(sumPointsTest);

    //check for invalid point values
    console.log(numPoints);
    console.log(!numPoints);
    if (!numPoints || !/\S/.test(numPoints)) {
        document.getElementById("pointsErr").innerHTML = "Error: please input a valid point value.";
        return
    }

    if (numPoints < 0) {
        document.getElementById("pointsErr").innerHTML = 'Error: no spending negative points!';
    }
    else if (numPoints == 0) {
        document.getElementById("pointsErr").innerHTML = 'No points spent! Was this on purpose?';
    }
    else if (numPoints <= sumPointsTest) {
        console.log('Rolling in the points!');
        const sortedTransactions = transactionList.sort((a, b) => a.timestamp - b.timestamp);
        console.log(sortedTransactions);

        //Instance of Object that stores payer name and points spent
        var payerListWithPointsSpent = [];
        for (var i = 0; i < payerList.length; i++) {
            var newEntry = new PayerListWithPointsSpent(payerList[i], 0);
            payerListWithPointsSpent.push(newEntry);
        }
        console.log(payerListWithPointsSpent);

        while (numPoints > 0) {
            //for (var i = 0; i < sortedTransactions.length; i++) {

            //if the number of points to spend is greater than the points in the oldest transaction
            if (numPoints >= sortedTransactions[0].points) {
                numPoints = numPoints - sortedTransactions[0].points;

                //find the appropriate payer in the list and subtract the number of points spent
                for (var i = 0; i < payerListWithPointsSpent.length; i++) {
                    //console.log('payer in list is ' + payerListWithPointsSpent[i].payer);
                    if (sortedTransactions[0].payer == payerListWithPointsSpent[i].payer) {
                        payerListWithPointsSpent[i].pointsSpent = payerListWithPointsSpent[i].pointsSpent + sortedTransactions[0].points * (-1);
                    }
                }

                //delete the oldest transaction
                sortedTransactions.shift();

                if (numPoints == 0) {
                    break;
                }

            } else { //if the number of points to spend is less than the points in the oldest transaction
                sortedTransactions[0].points = sortedTransactions[0].points - numPoints;

                //find the appropriate payer in the list and subtract the number of points spent
                for (var i = 0; i < payerListWithPointsSpent.length; i++) {
                    //console.log('payer in list is ' + payerListWithPointsSpent[i].payer);
                    if (sortedTransactions[0].payer == payerListWithPointsSpent[i].payer) {
                        payerListWithPointsSpent[i].pointsSpent = payerListWithPointsSpent[i].pointsSpent + numPoints * (-1);
                    }
                }

                numPoints = 0;
            }
            //}
        }

        var convertedPayerList = JSON.stringify(payerListWithPointsSpent);
        document.getElementById("points-spent-per-payer").innerHTML = convertedPayerList;

    } else {
        document.getElementById("pointsErr").innerHTML = 'Sorry, the number of points entered is greater than the number of points available to spend.';
    }
}


//pointsBalance function --> Return all payer point balances
function pointsBalance() {

    //Build dictionary that stores payer name and points balance
    function BalanceList(payer, pointsBalance) {
        this.payer = payer;
        this.pointsBalance = pointsBalance;
    }
    //add entries to payer-and-points balance list
    var balanceList = [];
    for (i = 0; i < payerList.length; i++) {
        var newEntry = new BalanceList(payerList[i], 0);
        balanceList.push(newEntry);
    }

    //if the payer name in the transaction list matches the payer name in the balance list, tally the balances for each payer.
    for (var i = 0; i < transactionList.length; i++) {
        for (var j = 0; j < balanceList.length; j++) {
            if (transactionList[i].payer == balanceList[j].payer) {
                balanceList[j].pointsBalance = balanceList[j].pointsBalance + transactionList[i].points;
            }
        }
    }

    //return balanceList;
    document.getElementById("balances").innerHTML = JSON.stringify(balanceList);
}
