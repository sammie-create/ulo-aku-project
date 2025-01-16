"use strict";

const inputUser = document.querySelector("#user");
const inputPin = document.querySelector("#pin");
const confirmUser = document.querySelector(".confirm__user");
const confirmPin = document.querySelector(".confirm__pin");

const loginBtn = document.querySelector(".login-btn");
const transferBtn = document.querySelector(".transfer-btn");
const loanBtn = document.querySelector(".loan-btn");
const closeBtn = document.querySelector(".close-btn");
const sortBtn = document.querySelector(".btn-sort");

const appContainer = document.querySelector(".app");
const labelWelcome = document.querySelector(".welcome-label");
const labelTimer = document.querySelector(".timer");
const transactions = document.querySelector(".transactions");
const balanceDate = document.querySelector(".date");
const balanceValue = document.querySelector(".balance-value");

const sumIn = document.querySelector(".sum-deposit");
const sumOut = document.querySelector(".sum-withdrawal");
const sumInterest = document.querySelector(".sum-interest");
const receiverName = document.querySelector(".receiver__name");
const transferValue = document.querySelector(".transfer-value");
const loanValue = document.querySelector(".loan-value");

const account1 = {
  owner: "Samuel Durumba",
  transactions: [3500, 2000, -5000, 1500, 52.25, 300, -1000, 500],
  interestRate: 1.2,
  pin: 1111,

  transactionsDates: [
    "2023-11-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2024-01-28T09:15:04.904Z",
    "2024-04-01T10:17:24.185Z",
    "2024-05-08T14:11:59.604Z",
    "2024-10-17T17:01:17.194Z",
    "2024-10-22T23:36:17.929Z",
    "2024-12-10T10:51:36.790Z",
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
    "2023-12-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2024-01-28T09:15:04.904Z",
    "2024-04-01T10:19:24.185Z",
    "2024-05-08T14:10:59.604Z",
    "2024-10-17T17:01:17.194Z",
    "2024-10-22T23:36:17.929Z",
    "2024-12-29T10:51:36.790Z",
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
    "2023-07-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2024-01-28T09:15:04.904Z",
    "2024-04-01T10:19:24.185Z",
    "2024-05-08T14:10:59.604Z",
    "2024-08-17T19:04:17.194Z",
    "2024-09-22T23:59:17.929Z",
    "2024-11-29T10:51:36.790Z",
  ],
  currency: "NGN",
  locale: "en-US",
};

const accounts = [account1, account2, account3];

// FUNCTIONS

// Format transaction movements date
function formatMovementDates(date) {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calcDaysPassed(date, new Date());

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(currentAccount.locale).format(date);
}

function formatTime(date) {
  // const tranDate = new Date(date);
  const options = {
    hour: "numeric",
    minute: "numeric",
  };
  return new Intl.DateTimeFormat(currentAccount.locale, options).format(date);
}

function formatCurrency(value, locale, currency) {
  const options = {
    style: "currency",
    currency: currency,
  };
  const formattedCurrency = new Intl.NumberFormat(locale, options).format(
    Math.abs(value)
  );
  return formattedCurrency;
}

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

    const transactionDate = new Date(acc.transactionsDates[i]);
    const displayDate = formatMovementDates(transactionDate);
    const transactionTime = new Date(acc.transactionsDates[i]);
    const displayTime = formatTime(transactionTime);

    const html = `<div class="transaction-row">
          <div class="transaction-detail">
            <p class="transaction-type transaction-type__${transType}">${
      i + 1
    } ${transType}</p>
            <span class="transaction-time">${displayTime}</span>
          </div>
          <div class="transaction-date">${displayDate}</div>
          <div class="transaction-value">${formatCurrency(
            tran,
            acc.locale,
            acc.currency
          )}</div>
        </div> `;

    transactions.insertAdjacentHTML("afterbegin", html);
    // console.log(html);
  });
}

// Display Balance

function displayBalance(acc) {
  const calcBalance = acc.transactions.reduce((acc, tran) => acc + tran);
  acc.balance = calcBalance;

  balanceValue.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
}

// Display Summary

function displaySummary(acc) {
  const sumDeposits = acc.transactions
    .filter(tran => tran > 0)
    .reduce((acc, tran) => acc + tran);

  sumIn.textContent = formatCurrency(sumDeposits, acc.locale, acc.currency);

  const sumWithdrawal = acc.transactions
    .filter(tran => tran < 0)
    .reduce((acc, tran) => acc + tran);

  sumOut.textContent = formatCurrency(sumWithdrawal, acc.locale, acc.currency);

  const sumInt = acc.transactions
    .filter(tran => tran > 0)
    .map(tran => (tran * 1.2) / 100)
    .reduce((acc, int) => acc + int);

  sumInterest.textContent = formatCurrency(sumInt, acc.locale, acc.currency);
}

// UPDATE UI

function updateUI(acc) {
  displayTransactions(acc);

  displayBalance(acc);

  displaySummary(acc);
}

function startLogOutTimer() {
  // Set timer to 3 mins
  let time = 60;
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time in it
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      appContainer.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    time--;
  }

  // Call the timer every second
  tick();
  timer = setInterval(tick, 1000);
  return timer;
}

// EVENT HANDLERS
let currentAccount, receiverAcc, timer;

// currentAccount = account1;
// appContainer.style.opacity = 1;
// updateUI(currentAccount);

loginBtn.addEventListener("click", function (e) {
  // prevents default action
  e.preventDefault();

  //converts user value to lowercase and finds the inputted user name
  currentAccount = accounts.find(
    acc => acc.username === inputUser.value.toLowerCase()
  );
  // confirms user pin
  if (currentAccount?.pin === Number(inputPin.value)) {
    appContainer.style.opacity = 1;

    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    // Date
    const dateToday = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      weekday: "long",
    };

    const locale = navigator.language;

    balanceDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(dateToday);

    // updates ui
    updateUI(currentAccount);

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // empties username and pin input fields
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

    // Add trransfer date to receivers account
    receiverAcc.transactionsDates.push(new Date().toISOString());

    //debits sender account
    currentAccount.transactions.push(Number(-transferValue.value));

    // Add date to sender account
    currentAccount.transactionsDates.push(new Date().toISOString());

    // update UI
    updateUI(currentAccount);

    // empties receivers name and transfer value input fields
    receiverName.value = transferValue.value = "";
  }
});

loanBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (currentAccount.transactions.find(tran => tran >= loanValue.value * 0.1)) {
    // Adds loan amount to acc transactions
    currentAccount.transactions.push(+loanValue.value);

    // Add loan date
    currentAccount.transactionsDates.push(new Date().toISOString());

    // updates UI
    updateUI(currentAccount);

    // empties loan value input field
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
    labelWelcome.textContent = `Log in to get started`;

    confirmUser.value = confirmPin.value = "";
  }
});

let sorted = false;
sortBtn.addEventListener("click", function (e) {
  e.preventDefault();

  displayTransactions(currentAccount, !sorted);
  sorted = !sorted;
});

// const arr = [40, 50, 60, -70, -89];
// const depo = arr.sort((a, b) => a - b);
// console.log(arr);

// console.log(depo);

// const str = "Top Falaye";
// console.log(
//   str
//     .toLowerCase()
//     .split(" ")
//     .map(name => name[0])
//     .join("")
// );
