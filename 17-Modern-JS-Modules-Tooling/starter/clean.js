`strict mode`;

const budget = Object.freeze([
  { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
  { value: -45, description: 'Groceries 🥑', user: 'jonas' },
  { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
  { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
  { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
  { value: -20, description: 'Candy 🍭', user: 'matilda' },
  { value: -125, description: 'Toys 🚂', user: 'matilda' },
  { value: -1800, description: 'New Laptop 💻', user: 'jonas' },
]);

const spendingLimits = Object.freeze({
  jonas: 1500,
  matilda: 100,
});
// spendingLimits.jay = 200;

if (!spendingLimits?.jay) {
  console.error('Jay is not defined');
}
console.log(spendingLimits);

const obj = { prop: 42 };
Object.freeze(obj);
obj.prop = 33;
console.log(obj.prop); // Output: 42
/**
 * Object.freeze() is used to freeze an object. Freezing an object
 * does not allow new properties to be added to an object, existing properties
 * can't be removed, prevents changing the enumerability, configurability, or writability
 * of existing properties. However the values of the properties can be changed as long as they are
 * writable. For example, the following code will not work:
 *
 * const obj = { prop: 42 };
 * Object.freeze(obj);
 * obj.prop = 33; // Throws an error in strict mode
 * console.log(obj.prop); // Output: 42
 *
 * The object is now frozen, and the property value can't be changed.
 * This however doesn`t throw an error even in strict mode.
 * But when we have an object with nested objects, the nested objects are not frozen.
 *
 * const obj = {
 * internal: {}
 * };
 * Object.freeze(obj);
 * obj.internal.a = 'aValue';
 * console.log(obj.internal.a); // Output: 'aValue'
 *
 * The nested object is not frozen, and its properties can be changed.
 * */

const getLimit = (limits, user) => limits?.[user] ?? 0;

// Pure function
const addExpense = function (
  state,
  limits,
  value,
  description,
  user = `Jonas`
) {
  const cleanUser = user.toLowerCase();

  return value <= getLimit(limits, cleanUser)
    ? [...state, { value: -value, description, user: cleanUser }]
    : state;
  // budget.push({value: -value, description: description, user: cleanUser});
};

const newBudget = addExpense(budget, spendingLimits, 10, 'Pizza 🍕');
const newBudget2 = addExpense(
  newBudget,
  spendingLimits,
  100,
  'Cinema 🍿',
  'Matilda'
);
const newBudget3 = addExpense(newBudget2, spendingLimits, 200, 'Stuff', 'Jay'); // Jay is not defined because of Object.freeze()
// prettier-ignore
const checkExpenses = function (state, limits) {
  return state.map(entry => {
    return entry.value < -getLimit(limits, entry.user)
      ? { ...entry, flag: 'limit' } // This is a new object, not changing the original object
      : entry;
  });
  // for (const entry of newBudget3) {
    // if (entry.value < -getLimit(limits, entry.user)) {
      // entry.flag = 'limit';
    // }
  // }
};
const finalBudget = checkExpenses(newBudget3, spendingLimits);
console.log(finalBudget);

// Impure because it logs to the console
const logBigExpenses = function (state, bigLimit) {
  const bigExpenses = state
    .filter(entry => entry.value <= -bigLimit)
    .map(entry => entry.description.slice(-2))
    .join(' / ');
  console.log(bigExpenses);

  // let output = '';
  // for (const entry of budget) {
  // if (entry.value <= -bigLimit) {
  // output += entry.description.slice(-2) + ' / '; // Emojis are 2 chars
  // }
  // }
  // output = output.slice(0, -2); // Remove last '/ '
  // console.log(output);

  // using reduce
  const output = state
    .filter(entry => entry.value <= -bigLimit)
    .reduce((acc, cur) => `${acc} / ${cur.description.slice(-2)}`, ``);
  console.log(output);
};
logBigExpenses(finalBudget, 500);
