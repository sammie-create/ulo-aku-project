"use strict";

const labelWelcome = document.querySelector(".welcome-label");
const inputUser = document.querySelector("#user");
const inputPin = document.querySelector("#pin");
const loginBtn = document.querySelector(".login-btn");
const appContainer = document.querySelector(".app");
const balanceDate = document.querySelector(".date");
const balanceValue = document.querySelector(".balance-value");
const transactions = document.querySelector(".transactions");
const sumIn = document.querySelector(".sum-deposit");
const sumOut = document.querySelector(".sum-withdrawal");
const sumInterest = document.querySelector(".sum-interest");
const transferBtn = document.querySelector(".transfer-btn");
const loanBtn = document.querySelector(".loan-btn");
const closeBtn = document.querySelector(".close-btn");
const sortBtn = document.querySelector(".btn-sort");
const receiverName = document.querySelector(".receiver__name");
const transferValue = document.querySelector(".transfer-value");
const loanValue = document.querySelector(".loan-value");
const confirmUser = document.querySelector(".confirm__user");
const confirmPin = document.querySelector(".confirm__pin");

const account1 = {
  owner: "Samuel Durumba",
  transactions: [3500, 2000, -5000, 1500, 52.25, 300, -1000, 500],
  interestRate: 1.2,
  pin: 1111,

  transactionsDates: [
    "2024-01-09T19:00:00.000Z",
    "2024-02-19T20:00:00.000Z",
    "2024-04-09T23:00:00.000Z",
    "2024-01-09T12:00:00.000Z",
    "2024-04-29T10:00:00.000Z",
    "2024-04-20T7:00:00.000Z",
    "2023-02-19T16:00:00.000Z",
    "2023-01-09T15:00:00.000Z",
  ],
  currency: "NGN",
  locale: "en-GB",
};

const account2 = {
  owner: "Funke Agbeye",
  transactions: [7500, 12000, -9000, 10500, 520.4, 300, -2000, 2500],
  interestRate: 1.5,
  pin: 2222,

  transactionsDates: [
    "2024-08-09T19:00:00.000Z",
    "2024-08-19T20:00:00.000Z",
    "2024-07-22T23:00:00.000Z",
    "2024-05-15T12:00:00.000Z",
    "2024-04-21T10:00:00.000Z",
    "2024-04-20T7:00:00.000Z",
    "2023-11-15T16:00:00.000Z",
    "2023-10-09T15:00:00.000Z",
  ],
  currency: "NGN",
  locale: "en-US",
};

const account3 = {
  owner: "Justin Manuaka",
  transactions: [500, 1200, -750, 25000, 798.4, 900, -2000, -144.0],
  interestRate: 1.5,
  pin: 3333,

  transactionsDates: [
    "2024-07-09T19:00:00.000Z",
    "2024-05-22T20:00:00.000Z",
    "2024-04-20T23:00:00.000Z",
    "2024-04-17T12:00:00.000Z",
    "2024-04-17T10:00:00.000Z",
    "2024-03-16T7:00:00.000Z",
    "2023-02-15T16:00:00.000Z",
    "2023-02-09T15:00:00.000Z",
  ],
  currency: "NGN",
  locale: "en-US",
};

const accounts = [account1, account2, account3];

// FUNCTIONS

// Create Usernames

function createUserName(account) {
  account.forEach(acc => {
    const [firstName, lastName] = acc.owner.toLowerCase().split(" ");
    acc.username = firstName[0].concat(lastName[0]);
  });
}
createUserName(accounts);

// Display Transactions

function displayTransactions(acc, sort = false) {
  transactions.innerHTML = " ";

  const trans = sort
    ? acc.transactions.slice(0).sort((a, b) => a - b)
    : acc.transactions;

  trans.forEach((tran, i) => {
    const transType = tran > 0 ? "deposit" : "withdrawal";

    const html = `<div class="transaction-row">
          <div class="transaction-detail">
            <p class="transaction-type transaction-type__${transType}">${
      i + 1
    } ${transType}</p>
            <span class="transaction-time">4:00 PM</span>
          </div>
          <div class="transaction-date">20/10/2024</div>
          <div class="transaction-value">₦${Math.abs(tran)}</div>
        </div> `;

    transactions.insertAdjacentHTML("afterbegin", html);
    // console.log(html);
  });
}

// Display Balance

function displayBalance(acc) {
  const calcBalance = acc.transactions.reduce((acc, tran) => acc + tran);
  acc.balance = calcBalance;
  balanceValue.textContent = `₦${calcBalance}`;
}

// Display Summary

function displaySummary(acc) {
  const sumDeposits = acc.transactions
    .filter(tran => tran > 0)
    .reduce((acc, tran) => acc + tran);

  sumIn.textContent = `₦${sumDeposits.toFixed(2)}`;

  const sumWithdrawal = acc.transactions
    .filter(tran => tran < 0)
    .reduce((acc, tran) => acc + tran);

  sumOut.textContent = `₦${Math.abs(sumWithdrawal.toFixed(2))}`;

  const sumInt = acc.transactions
    .filter(tran => tran > 0)
    .map(tran => (tran * 1.2) / 100)
    .reduce((acc, int) => acc + int);

  sumInterest.textContent = `₦${sumInt.toFixed(2)}`;
}

// UPDATE UI

function updateUI(acc) {
  displayTransactions(acc);

  displayBalance(acc);

  displaySummary(acc);
}

// EVENT HANDLERS
let currentAccount, receiverAcc;

// currentAccount = account1;
// appContainer.style.opacity = 1;
// updateUI(currentAccount);

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputUser.value.toLowerCase()
  );
  if (currentAccount.pin === Number(inputPin.value)) {
    appContainer.style.opacity = 1;

    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    updateUI(currentAccount);

    inputUser.value = inputPin.value = "";
    inputPin.blur();
  } else {
    alert("Wrong Details");
  }
});

transferBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // finds receievers' account
  receiverAcc = accounts.find(acc => acc.username === receiverName.value);

  if (
    receiverAcc &&
    receiverAcc !== currentAccount &&
    receiverName.value === receiverAcc.username &&
    transferValue.value <= currentAccount.balance
  ) {
    // Adds to  receivers account
    receiverAcc.transactions.push(+transferValue.value);

    //debits sender account
    currentAccount.transactions.push(Number(-transferValue.value));

    // update UI
    updateUI(currentAccount);

    receiverName.value = transferValue.value = "";
  }
});

loanBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (currentAccount.transactions.find(tran => tran >= loanValue.value * 0.1)) {
    // Adds loan amount to acc transactions
    currentAccount.transactions.push(+loanValue.value);

    // update UI
    updateUI(currentAccount);

    loanValue.value = "";
  }
});

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === confirmUser.value &&
    currentAccount.pin === Number(confirmPin.value)
  ) {
    // finds user account
    const index = accounts.findIndex(acc => acc.username === confirmUser.value);

    // deletes user account
    accounts.splice(index, 1);

    // logs user out
    appContainer.style.opacity = 0;

    confirmUser.value = confirmPin.value = "";
  }
});

let sorted = false;
sortBtn.addEventListener("click", function (e) {
  e.preventDefault();

  displayTransactions(currentAccount, !sorted);
  sorted = !sorted;
});

const arr = [40, 50, 60, -70, -89];
const depo = arr.sort((a, b) => a - b);
console.log(arr);

console.log(depo);

const str = "Top Falaye";
console.log(
  str
    .toLowerCase()
    .split(" ")
    .map(name => name[0])
    .join("")
);
