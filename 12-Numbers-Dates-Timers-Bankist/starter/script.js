'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-01-18T21:31:17.178Z',
    '2024-01-10T07:42:02.383Z',
    '2024-01-15T09:15:04.904Z',
    '2024-01-01T10:17:24.185Z',
    '2024-01-08T14:11:59.604Z',
    '2024-01-19T17:01:17.194Z',
    '2024-01-11T23:36:17.929Z',
    '2024-01-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-GB', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// create a function which calculate the dates of the movements and instead of displaying the date we will display the number of days ago the movement was made
const formatMovementDate = function (date, locale) {
  const calcDaysPassed2 = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  // 1000 is for converting milliseconds to seconds
  // 60 is for converting seconds to minutes
  // 60 is for converting minutes to hours
  // 24 is for converting hours to days

  const daysPassed = calcDaysPassed2(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0); // every time we have a number with only one digit, we want to add a 0 in front of it
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0); // every time we have a number with only one digit, we want to add a 0 in front of it
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}
        </div>
    <div class="movements__date">${formatMovementDate(date, acc.locale)}
    </div>
        <div class="movements__value">${formatCur(
          mov,
          acc.locale,
          acc.currency
        )}
        </div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// .toFixed(2) is a method that rounds the number to 2 decimals

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${formatCur(incomes, acc.locale, acc.currency)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${formatCur(
    Math.abs(out),
    acc.locale,
    acc.currency
  )}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${formatCur(
    interest,
    acc.locale,
    acc.currency
  )}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0); // every time we have a number with only one digit, we want to add a 0 in front of it
    const sec = String(time % 60).padStart(2, 0);
    // in the above line, we use the remainder operator to get the remainder of the division of time by 60
    // 5 % 2 = 1 instead of 5 / 2 = 2.5

    // in each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // decrease 1 second
    time--;
  };

  // set time to 5 minutes
  let time = 300;

  // call the timer every second
  tick(); // we call it once here because if we don't, the timer will start after 1 second
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// fake always logged in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    //const dayOfTheWeek = new Intl.DateTimeFormat(currentAccount.locale, {
    //  weekday: 'long',
    //}).format(now);
    //const day = `${now.getDate()}`.padStart(2, 0); // every time we have a number with only one digit, we want to add a 0 in front of it
    //const month = `${now.getMonth() + 1}`.padStart(2, 0);
    //const year = now.getFullYear();
    //const hour = `${now.getHours()}`.padStart(2, 0);
    //const minute = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${dayOfTheWeek}, ${day}/${month}/${year}, ${hour}:${minute}`;
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);

    if (timer) clearInterval(timer);
    // start logout timer
    timer = startLogOutTimer();
  }});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value; // the + sign converts the string to a number
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // setTimeout
    setTimeout(function () {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // reset timer
    if (timer) clearInterval(timer);
    // start logout timer
    timer = startLogOutTimer();
    }, 2500);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  // we use .floor because we want to round down the number
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // setTimeout
    setTimeout(function () {
    // Add movement
    currentAccount.movements.push(amount);

    // add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // reset timer
    // if timer exists, clear it
    if (timer) clearInterval(timer);
    // start logout timer
    timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

console.log(23 === 23.0); // true

// in Javascript doing scientific calculation is not possible because of how Javascript was initially designed
console.log(0.1 + 0.2 === 0.3);
// this return false because the real result of this addition is 0.3000000000004 and not 0.3

// conversion
console.log(typeof Number(`3`));
// same as
console.log(typeof +`3`);
// every time we use the + operator, Javascript will convert the string to a number if possible

// parsing integer anf floats (only works with strings)
console.log(Number.parseInt(`30px`, 10));
// 10 is the base of the number system we want to parse
console.log(Number.parseInt(`e23`, 10)); // NaN because it doesn't start with a number
console.log(Number.parseFloat(`2.5rem`)); // 2.5, if parseInt it would return 2

// check if value is NaN
console.log(Number.isNaN(20)); // false
console.log(Number.isNaN(`20`)); // false
console.log(Number.isNaN(+'20X')); // true

// checking if a value is a number
console.log(Number.isNaN(23 / 0)); // false
console.log(Number.isFinite(20)); // true
console.log(Number.isFinite(`20`)); // false
console.log(Number.isFinite(+'20X')); // false
console.log(Number.isFinite(23 / 0)); // false, the result of this operation is infinity

console.log(Number.isInteger(23)); // true
console.log(Number.isInteger(23.0)); // true
console.log(Number.isInteger(23 / 0)); // false

// Math and rounding
console.log(Math.sqrt(25)); // 5
console.log(25 ** (1 / 2)); // 5
console.log(8 ** (1 / 3)); // 2

console.log(Math.max(5, 18, 23, 11, 2)); // 23
console.log(Math.max(5, 18, `23`, 11, 2)); // 23
console.log(Math.max(5, 18, `23px`, 11, 2)); // NaN

console.log(Math.min(5, 18, 23, 11, 2)); // 2

console.log(Math.PI * Number.parseFloat(`10px`) ** 2); // 314.1592653589793, area of a circle

console.log(Math.trunc(Math.random() * 6) + 1); // random number between 1 and 6

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min; // random number between min and max
console.log(randomInt(10, 20));

// rounding integers
console.log(Math.trunc(23.3)); // 23

console.log(Math.round(23.3)); // 23
console.log(Math.round(23.9)); // 24

console.log(Math.ceil(23.3)); // 24
console.log(Math.ceil(23.9)); // 24

console.log(Math.floor(23.3)); // 23
console.log(Math.floor(`23.9`)); // 23
// trunc and floor are the same for positive numbers but floor is different for negative numbers because it rounds down instead of truncating
console.log(Math.trunc(-23.3)); // -23
console.log(Math.floor(-23.3)); // -24
// floor is the best method to round numbers

// rounding decimals
console.log((2.7).toFixed(0)); // 3, returns a string
// toFixed always returns a string
console.log((2.7).toFixed(3)); // 2.700, here 3 is the number of decimals we want to keep in the string after the dot
console.log((2.345).toFixed(2)); // 2.35

// the remainder operator
console.log(5 % 2); // 1
console.log(5 / 2); // 2.5
console.log(8 % 3); // 2

const isEven = n => n % 2 === 0;
console.log(isEven(8)); // true
console.log(isEven(23)); // false
console.log(isEven(514)); // true

// labelBalance.addEventListener('click', () => {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) {
//       row.style.backgroundColor =
//         row.style.backgroundColor === 'orangered' ? '' : 'orangered';
//     } else {
//       row.style.backgroundColor = '';
//     }
//     if (i % 3 === 0) {
//       row.style.backgroundColor =
//         row.style.backgroundColor === 'blue' ? '' : 'blue';
//     } else {
//       row.style.backgroundColor = '';
//     }
//   });
// });

// underscore positions
const diameter = 28746000000; // 28 746 000 000 km
console.log(diameter);
// numeric separator
const diameter2 = 28_746_000_000; // underscore is ignored by Javascript
console.log(diameter2);

// underscore position restrictions
const PI = 3.1415_9265; // valid
// const PI = _3.1415_9265; // invalid
// const PI = 3.1415_9265_; // invalid
// const PI = 3._1415__9265; // invalid
console.log(PI);

console.log(Number(`230_000_000`)); // NaN

// BigInt
console.log(2 ** 53 - 1); // 9007199254740991
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(2 ** 53 + 1); // 9007199254740992
console.log(2 ** 53 + 2); // 9007199254740994
console.log(2 ** 53 + 3); // 9007199254740996
// unsafe numbers: numbers that are bigger than 2 ** 53 - 1 usually cause problems in Javascript because of the way Javascript stores numbers in memory (64 bits) and the way it does calculations

// BigInt is a new primitive type in Javascript that allows us to store numbers as big as we want

console.log(4830832940723598203475982347n); // n at the end of the number means that it's a BigInt
console.log(BigInt(4830832940723598203475982347)); // same as above but different output for very big numbers. It`s best to use the first method (with the n at the end)
console.log(BigInt(48304334343433434832947n)); // now BigInt works because the number is not too big but still bigger than 2 ** 53 - 1
console.log(10000n + 10000n); // 20000n, means this is a BigInt
console.log(4830832940723598203475982347n * 100000n); // 483083294072359820347598234700000n

console.log(20n > 15); // true
console.log(20n === 20); // false because they are different types
console.log(typeof 20n); // bigint

console.log(20n == 20); // true, this is a special case
console.log(20n == '20'); // true, this is a special case
console.log(20n === '20'); // false, this is a special case
console.log(20n > '20'); // false, this is a special case

// things you can`t do with BigInt
// console.log(Math.sqrt(16n)); // error
console.log(16n / 3n); // 5n, the result is rounded down
console.log(16 / 3); // 5.333333333333333

// dates and times
// create a date
const now = new Date();
console.log(now);

console.log(new Date(`Jan 18 2024 18:05:41`));
console.log(new Date(`December 24, 2015`)); // set the time to midnight automatically
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5)); // 10 is November because months are zero based
console.log(new Date(2037, 10, 31)); // if the month has 30 days, it will automatically set the date to the first day of the next month (December 1st)
console.log(new Date(0)); // January 1st 1970 at midnight

console.log(new Date(3 * 24 * 60 * 60 * 1000)); // 3 days after January 1st 1970 at midnight
// how this works:
// 3 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

const future = new Date(2037, 10, 19, 15, 23);
console.log(future); // 2037-11-19T15:23:00.000Z
console.log(future.getFullYear()); // 2037
console.log(future.getMonth()); // 10, November
console.log(future.getDate()); // 19, day of the month
console.log(future.getDay()); // 4, day of the week, Thursday, 0 is Sunday
console.log(future.getHours()); // 15
console.log(future.getMinutes()); // 23
console.log(future.getSeconds()); // 0
console.log(future.toISOString()); // 2037-11-19T15:23:00.000Z
console.log(future.getTime()); // 2142248580000, timestamp, number of milliseconds that have passed since January 1st 1970 at midnight

console.log(new Date(2142248580000)); // 2037-11-19T15:23:00.000Z same as future, based on milliseconds

console.log(Date.now()); // timestamp of now in milliseconds

future.setFullYear(2040);
console.log(future); // 2040-11-19T15:23:00.000Z, notice that the day of the week has changed

// calculation with dates
const future2 = new Date(2037, 10, 19, 15, 23);
console.log(+future2); // 2142248580000, same as future.getTime()
const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
/* 1000 is for converting milliseconds to seconds
   60 is for converting seconds to minutes
   60 is for converting minutes to hours
   24 is for converting hours to days */

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1); // 10

// Internationalizing numbers (Intl)
const num = 3884764.23;

const options = {
  style: 'unit', // unit, percent or currency
  unit: 'celsius', // celsius, fahrenheit, mile-per-hour, etc
  currency: 'EUR',
  // useGrouping: false,
};

console.log('US: ', new Intl.NumberFormat('en-US', options).format(num)); // US:  3,884,764.23
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num)); // Germany:  3.884.764,23
console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(num)); // Syria:  ٣٬٨٨٤٬٧٦٤٫٢٣
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language).format(num)
); // en-US 3,884,764.23

// setTimeout
const ingredients = [`olives`, `spinach`];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log(`Waiting...`);
if (!ingredients.includes(`spinach`)) {
  clearTimeout(pizzaTimer);
  console.log(`Timer cleared`);
} else {
  console.log(`Pizza's coming...`);
}

// setInterval
let countIntervals = 0;
setInterval(function () {
  console.log(`Interval ${++countIntervals}`);
}, 50000);
// this will run forever, every 50 seconds. Not a good idea to use this

// setInterval with a date
setInterval(function () {
  const now = new Date();
  console.log(`interval at minute ${now.getMinutes()}`);
}, 60000);