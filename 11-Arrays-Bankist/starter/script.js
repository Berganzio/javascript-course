'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////

const displayMovements = (movements, sort = false) => {
  // clear container before displaying movements
  containerMovements.innerHTML = ``;

  // sort movements
  // slice method is used to create a copy of the array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements">
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const getUsernameInitials = accountsList => {
  accountsList.forEach(account => {
    account.username = account.owner
      .split(` `)
      .map(word => word.charAt(0))
      .join(``)
      .toLowerCase();
  });
};

const calcDisplayBalance = function (account) {
  // create 'balance' property and assign the value
  account.balance = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  // now we have to assign this value to summary__value--in class
  labelSumIn.textContent = `${account.balance}€`;

  const totalBalanceOut = Math.abs(
    account.movements
      .filter(mov => mov < 0)
      .reduce((acc, curr) => acc + curr, 0)
  );
  labelSumOut.textContent = `${totalBalanceOut}€`;

  const totalBalanceInterests = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov >= 1) // only interests >= 1€ are considered
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${totalBalanceInterests}€`;

  labelBalance.textContent = `${account.balance - totalBalanceOut}€`;
};

const updateUI = function (account) {
  // clear container before displaying movements
  containerMovements.innerHTML = ``;
  // display movements
  displayMovements(account.movements);
  // display balance and interests
  calcDisplayBalance(account);
};

// display username initials
getUsernameInitials(accounts);

// event handlers

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // submit prevention
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // optional chaining with ?. operator. Literally: if currentAccount exists AND pin is correct

    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();

    // update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // clear input fields
  inputTransferAmount.value = inputTransferTo.value = ``;

  if (
    receiverAcc &&
    receiverAcc.balance >= amount &&
    receiverAcc.username == !currentAccount.username &&
    amount > 0
  ) {
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);
    // update UI
    updateUI(currentAccount);
  }

  // clear input field
  inputLoanAmount.value = ``;
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
    // delete account
    accounts.splice(index, 1); // 1 means delete 1 element
    // hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = ``; // clear input fields
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  // !sorted is the same as

  sorted = !sorted;
  /* if (!sorted) {
    displayMovements(currentAccount.movements, true);
    sorted = true;
  }
  else {
    displayMovements(currentAccount.movements, false);
    sorted = false;
  } */
});

///////////////////////////////////////////////////////

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
*/

const checkDogs = (dogsJulia, dogsKate) => {
  const juliaCopy = dogsJulia.slice(1, -2);
  const kateCopy = dogsKate.slice(1, -2);
  console.log(juliaCopy, kateCopy);
  const allDogs = juliaCopy.concat(kateCopy);
  for (let i = 0; i < allDogs.length; i++) {
    console.log(
      `Dog number ${i + 1} ${
        allDogs[i] > 3 ? `is an adult` : `is still a puppy 🐶`
      }`
    );
  }
};

console.log('-----------checkDogs-----------');
checkDogs([3, 5, 2, 12, 7], [9, 16, 6, 8, 3]);
console.log('-----------checkDogs2----------');
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

const USDcurrency = 1.1;

const totalDepositUSD = Math.round(
  account4.movements
    .filter(mov => mov > 0)
    .map(mov => mov * USDcurrency)
    .reduce((acc, curr) => acc + curr, 0)
);

// map method
const movementsUSD = account1.movements.map(mov => mov * USDcurrency);
console.log('-----------movementsUSD----------');
console.log(movementsUSD);

const movementsDescriptions = account2.movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? `deposited` : `withdrew`} ${Math.abs(
      mov
    )}`
);
console.log('-----------movementsDescriptions----------');
console.log(movementsDescriptions);

const user = `Andrea Bergantin`;

// filter method
const deposit = account3.movements.filter(function (mov) {
  return mov > 0;
});
console.log('-----------deposit with "filter"----------');
console.log(deposit);

const depositFor = [];
for (const mov of deposit) if (mov > 0) depositFor.push(mov);
console.log('-----------deposit with "for - of"----------');
console.log(depositFor);

const withdrawal = account4.movements.filter(mov => mov < 0);
console.log('-----------withdrawal----------');
console.log(withdrawal);

// reduce method
const balance = account1.movements.reduce(function (
  accumulator,
  currentValue,
  index
) {
  console.log(
    `Iteration ${index}: accumulator ${accumulator} + current value ${currentValue}`
  );
  return accumulator + currentValue;
});
console.log('-----------balance with "reduce"----------');
console.log(`array: [${account1.movements}] \nresult: ${balance}`);

const maxValue = account2.movements.reduce((a, b) => (a > b ? a : b));
console.log('-----------maxValue with "reduce"----------');
console.log(maxValue);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
*/

const calcAverageHumanAge = function (ages) {
  const ageComparison = [];
  let counter = 0;
  for (let i = 0; i < ages.length; i++) {
    const humanYears = ages[i] <= 2 ? ages[i] * 2 : 16 + ages[i] * 4;
    ageComparison.push(humanYears);
  }
  const adults = ageComparison.filter(age => age >= 18);
  for (let i = 0; i < adults.length; i++) {
    counter += adults[i];
  }
  counter = counter / adults.length;
  console.log(
    `The average age for the ${
      adults.length
    } dogs older than 18 human years old is: ${Math.round(counter)} years old.`
  );
};

calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

const newCalcAverageHumanAge = function (ages) {
  const avgHumanAge = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, _, array) => acc + age / array.length, 0);

  console.log(
    `The average age for the adult dogs is: ${Math.round(
      avgHumanAge
    )} years old.`
  );
};

newCalcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]


// old function
const newCalcAverageHumanAge = function (ages) {
  const avgHumanAge = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, _, array) => acc + age / array.length, 0);

  console.log(
    `The average age for the adult dogs is: ${Math.round(
      avgHumanAge
    )} years old.`
  );
};
*/

// new function
const newNewCalcAverageHumanAge = ages =>
  Math.round(
    ages
      .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
      .filter(age => age >= 18)
      .reduce((acc, age, _, array) => acc + age / array.length, 0)
  );
console.log('-----------newNewCalcAverageHumanAge----------');
console.log(newNewCalcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// other useful methods

// includes method
console.log('-----------includes method----------');
console.log(account1.movements.includes(-130));

// some method
console.log('-----------some method----------');
console.log(account1.movements.some(mov => mov > 0));

/* the includes method only checks for equality
while the some method checks for a condition */

// every method
console.log('-----------every method----------');
console.log(account1.movements.every(mov => mov > 0));

// separate callback
const deposits = mov => mov > 0;

console.log('-----------separate callback----------');
console.log(account1.movements.some(deposits));
console.log(account1.movements.every(deposits));
console.log(account1.movements.filter(deposits));

// flat method
console.log('-----------flat method----------');
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log('-----------arr 1 level of depth----------');
console.log(arr.flat());

// this is an array with 2 levels of depth
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log('-----------arrDeep 2 levels of depth----------');
console.log(arrDeep.flat(2));

// flat method is useful to remove empty elements
const accountMovements = accounts.map(acc => acc.movements);
console.log('-----------accountMovements----------');
console.log(accountMovements);

const allMovements = accountMovements.flat();
console.log('-----------allMovements----------');
console.log(allMovements);

const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log('-----------overallBalance----------');
console.log(overallBalance);

/* chaining would be:
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
*/

// flatMap method
const overallBalance2 = accounts
  .flatMap(acc => acc.movements) // flatMap is the same as map + flat of 1 level of depth
  .reduce((acc, mov) => acc + mov, 0);
console.log('-----------flatMap method----------');
console.log(overallBalance2);

// sorting arrays
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log('-----------sorting arrays----------');
console.log(owners.sort()); // mutates the original array
console.log(owners);

// numbers
console.log('-----------sorting numbers----------');
console.log(account1.movements);
console.log('not sorted');
console.log(account1.movements.sort());
// doesn't work as expected because it converts numbers to strings so if we have 100 and 20 it will sort 100 before 20 because 1 is before 2
console.log('ascending order');
console.log(account1.movements.sort((a, b) => a - b)); // works as expected
console.log('descending order');
console.log(account1.movements.sort((a, b) => b - a)); // works as expected

// creating and filling arrays
console.log('-----------creating and filling arrays----------');
const arr2 = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7), arr2);
console.log('-----------creating arrays with Array.from----------');
// second parameter is an unnamed arrow function that returns 1
const y2 = Array.from({ length: 7 }, () => 1);
console.log(y2);
const z2 = Array.from({ length: 7 }, (_, i) => i + 1); // first parameter is unused
console.log(z2);
const arr2Insertion = Array.from(
  { length: arr2.length },
  // insert all arr2 values
  (_, i) => arr2[i]
);
console.log(arr2Insertion);
// another way is using .querySelectorAll method on the movements__value class, however if we want to see the actual values we have to create an event handler
console.log('-----------event handler with .querySelectorAll----------');
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    mov => Number(mov.textContent.replace('€', ''))
  );
  console.log(movementsUI);
  // another option is to use the spread operator
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});
console.log('-----------empty arrays----------');
const x = new Array(7);
console.log(x);
console.log(x.map(() => 5)); // doesn't work because x is an empty array
console.log('-----------fill method----------');
x.fill(1);
console.log(x);
console.log('-----------fill method with start and end parameters----------');
const y = new Array(7);
y.fill(1, 3, 5); // start at index 3 and end at index 5
console.log(y);
console.log('-----------fill method with map----------');

// prefixed ++ operators
let a = 10;
console.log('-----------prefixed ++ operators----------');
console.log(++a);
console.log(a);
// use case
const sumDeposit1000 = account1.movements
  .flatMap(mov => mov)
  .filter(value => value > 0)
  .reduce((count, curr) => (curr >= 1000 ? ++count : count));
console.log(sumDeposit1000);

// destructuring arrays
console.log('-----------destructuring arrays----------');
const { dep, withdr } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      sums[curr > 0 ? `dep` : `withdr`] += curr;
      return sums; // return because it has curly braces so we have to return the object manually
    },
    { dep: 0, withdr: 0 }
  );
console.log(dep, withdr);

// function practice with arrays
console.log('-----------function practice with arrays----------');
const convertTitleCase = function (word) {
  const exceptions = [`a`, `an`, `the`, `but`, `or`, `on`, `in`, `with`];

  const titleCase = word
    .toLowerCase()
    .split(` `)
    .map(word =>
      !exceptions.includes(word) ? word[0].toUpperCase() + word.slice(1) : word
    )
    .join(` `);
  return titleCase[0].toUpperCase() + titleCase.slice(1);
};
console.log(convertTitleCase(`This is a nice title`));
console.log(convertTitleCase(`This is a LONG title but not too long`));
console.log(convertTitleCase(`and here is another title with an EXAMPLE`));

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
*/

// TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// 1.
console.log(`before`);
for (const dog of dogs) {
  console.log(dog);
}

dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);

console.log(`after`);
for (const dog of dogs) {
  console.log(dog);
}

// 2.
for (const dog of dogs) {
  if (dog.owners.includes(`Sarah`)) {
    console.log(`Sarah\`s dog is dog #${dogs.indexOf(dog) + 1}`);
  }
}
// ES6 way
const sarahDog = dogs.find(dog => dog.owners.includes(`Sarah`));
console.log(sarahDog);
console.log(
  `Sarah\`s dog is dog #${dogs.findIndex(dog => dog.owners.includes(`Sarah`))}`
);

// 3.
const ownersEatTooMuch = [];
const ownersEatTooLittle = [];

for (const dog of dogs) {
  if (dog.curFood > dog.recommendedFood) {
    ownersEatTooMuch.push(dog.owners);
  } else if (dog.curFood < dog.recommendedFood) {
    ownersEatTooLittle.push(dog.owners);
  }
}
console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);
// ES6 way
const ownersEatTooMuch2 = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch2);

const ownersEatTooLittle2 = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle2);

// 4.
console.log(`${ownersEatTooMuch.flat().join(` and `)}'s dogs eat too much!`);
console.log(
  `${ownersEatTooLittle.flat().join(` and `)}'s dogs eat too little!`
);

// 5.
for (const dog of dogs) {
  if (dog.curFood === dog.recommendedFood) {
    console.log(true);
  } else {
    console.log(false);
  }
}
// ES6 way
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6.
for (const dog of dogs) {
  if (
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
  ) {
    console.log(true);
  } else {
    console.log(false);
  }
}
// ES6 way
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);

// 7.
const goodDogs = [];
for (const dog of dogs) {
  if (
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
  ) {
    goodDogs.push(dog);
  }
}
console.log(goodDogs);
// ES6 way
const ES6goodDogs = dogs.filter(dog => dog.curFood > dog.recommendedFood * 0.9 && dog.curFood < dog.recommendedFood * 1.1);
console.log(ES6goodDogs);

// 8.
const dogsCopy = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsCopy)