"use strict";

// Data
const account1 = {
  owner: "Med Amine Sayes",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 2222,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: "Bianca Ioana",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1111,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Thomas Edison",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "fr-FR",
};

const account4 = {
  owner: "Sarah Gorden",
  movements: [430, 1000, 700, 50, 90, -33],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const createUserNames = function (acc) {
  acc.forEach((account, i) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserNames(accounts);

let dateFormat = function (date, locale) {
  const calcPassedDays = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const daysPassed = calcPassedDays(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed === 0) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

let CurrencyFormat = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  /// Remove the html template of movements
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const date = new Date(acc.movementsDates[i]);

    const displayDate = dateFormat(date, acc.locale);

    const type = mov > 0 ? "deposit" : "withdrawal";

    const movFormat = CurrencyFormat(Math.abs(mov), acc.locale, acc.currency);

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${movFormat}</div>
        </div>`;

    /// add html

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const displaySummary = function (acc) {
  let incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  let out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  let interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .reduce((acc, mov) => mov + acc);

  labelSumIn.textContent = CurrencyFormat(
    Math.abs(incomes),
    acc.locale,
    acc.currency
  );
  labelSumOut.textContent = CurrencyFormat(
    Math.abs(out),
    acc.locale,
    acc.currency
  );
  labelSumInterest.textContent = CurrencyFormat(
    Math.abs(interest),
    acc.locale,
    acc.currency
  );
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cv) => acc + cv, 0);

  labelBalance.textContent = CurrencyFormat(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const updateUi = function (currentAccount) {
  displayMovements(currentAccount);
  displaySummary(currentAccount);
  calcPrintBalance(currentAccount);
};
// Event Handler

// Login Event

let currentAccount;

currentAccount = account1;
updateUi(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener("click", function (e) {
  // prevent the form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = ` Welcome  ${currentAccount.owner} `;
    containerApp.style.opacity = 100;

    // create current date and time

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const now = new Date();
    // const day = `${now.getDay()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minute = now.getMinutes();

    // labelDate.textContent = `${day}/${month}/${year},${hour}:${minute} `;

    inputLoginPin.value = inputLoginUsername.value = "";
    updateUi(currentAccount);
  }
});

// Transfer Money Event

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUi(currentAccount);
  }
});

// Request Loan Event

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    currentAccount.movements.push(loanAmount);

    currentAccount.movementsDates.push(new Date().toISOString());

    updateUi(currentAccount);
  }
});

// Disconnect from the account Event

btnClose.addEventListener("click", function (currentAccount) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const i = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(i, 1);
    console.log(accounts);
    labelWelcome.textContent = ` Begin by logging in ▶ `;
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = "";
});

// Sort Movement Event
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Date

// let calcPassedDays = function (date1, date2) {
//   return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
// };
// console.log(calcPassedDays(new Date(2023, 5, 10), new Date(2023, 5, 25)));
