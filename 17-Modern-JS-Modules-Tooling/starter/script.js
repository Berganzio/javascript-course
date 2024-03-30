// importing module
// import { addToCart, totalPrice as price, quantity } from './shoppingCart.js';

// import './shoppingCart.js';
// console.log(`Importing module`);

// import { addToCart } from './shoppingCart.js';
// addToCart('bread', 5);

// import * as ShoppingCart from './shoppingCart.js';
// ShoppingCart.addToCart('Tomatoes', 10);
// console.log(ShoppingCart.totalPrice);

/**
 * Difference between default and named exports:
 *
 * Default exports are used to export only one thing from a module.
 * Named exports are used to export multiple things from a module.
 * Both can be used in the same module and in the same import statement.
 *
 * REMEMBER: What you export become a copy of the original value, not a reference.
 */

import add, { cart } from './shoppingCart.js';
add('pizza', 2);
add('bread', 5);
add('apples', 4);

console.log(cart);

/*
const fetchTodo = function() {
  // promise version
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(response => {
    response.title = `Do more coding!`
    response.completed = true;
    return response;
  })
  .then(json => console.log(json));
};

fetchTodo();
*/

let TodoID = 1;
// async/await version
const fetchTodoAsync = async function (title, completion = false) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${TodoID++}`
    );
    const data = await response.json();
    data.title = title;
    data.completed = completion;
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

fetchTodoAsync('Do more coding!', true);
fetchTodoAsync(`Ride a bike!`);

const getLastPost = async function () {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    const data = await response.json().then(json => json.at(-1));
    // .at() is a new method in ES2022 for retrieving data at a specific index.
    console.log(data);
  } catch (error) {
    console.error(`Error occurred: ${error}`);
  }
};
getLastPost();

// The module pattern

const shoppingCart2 = (function () {
  const cart = [];
  const shippingCost = 10;
  const totalPrice = 237;
  const totalQuantity = 23;

  const addToCart = function (product, quantity) {
    cart.push({ product, quantity });
    console.log(`${quantity} ${product} added to cart`);
    console.log(`Shipping cost is ${shippingCost}`);
  };

  const orderStock = function (product, quantity) {
    console.log(`${quantity} ${product} ordered from supplier`);
  };

  return {
    addToCart,
    cart,
    totalPrice,
    totalQuantity,
  };
})();

shoppingCart2.addToCart('apple', 4);
shoppingCart2.addToCart('pizza', 2);
//shoppingCart2.orderStock('apple', 4); // throws an error because orderStock is not exported
console.log(shoppingCart2);

console.log(shoppingCart2.shippingCost); // undefined
/**
 * Why is this undefined?
 * Because shippingCost is a private variable in the module pattern.
 * It is not accessible from the outside.
 * To access it, we need to return it from the module.
 */

/**
 * CommonJS Modules
 *
 * CommonJS modules are used in Node.js.
 * They are synchronous and blocking.
 * They are loaded only once and they are cached.
 */

// export
//export.addToCart = function(product, quantity) {
//cart.push({product, quantity});
//console.log(`${quantity} ${product} added to cart`);
//};

// import
const { addToCart } = require('./shoppingCart.js'); // require is a CommonJS feature

//import cloneDeep from './node_modules/lodash-es/cloneDeep.js';
import cloneDeep from 'lodash-es';
/**
 * deepClone is a function that creates a deep copy of an object.
 * It is a function from the lodash-es library.
 */
const state = {
  cart: [
    { product: 'bread', quantity: 5 },
    { product: 'pizza', quantity: 3 },
  ],
  user: { loggedIn: true },
};
const stateClone = Object.assign({}, state);
const stateDeepClone = cloneDeep(state);

state.user.loggedIn = false; // this will apply only to the original object

console.log(stateClone); // false
console.log(stateDeepClone); // true

if (module.hot) {
  // parcel feature for hot module replacement without refreshing the page
  module.hot.accept();
}

console.log('Hello, World!');

class Person {
  greeting = `Hey`;
  constructor(name) {
    this.name = name;
    console.log(`${this.greeting}, ${this.name}`);
  }
}
const jonas = new Person('Jonas');

console.log('Jonas' ?? null); // ?? is the nullish coalescing operator

console.log(cart.find(el => el.quantity > 1)); // find method

Promise.resolve('Test').then(x => console.log(x)); // Promise.resolve

import 'core-js/stable';
/**
 * Polyfilling is the process of adding new features to older browsers that do not support them.
 * It is done by adding a piece of code that provides the missing functionality.
 * This is done by using a polyfill library like core-js.
 * Core-js is a library that provides polyfills for many features including ES6 and ES7 features
 * like promises, symbols, arrow functions, and more.
 * So importing 'core-js/stable' will polyfill everything.
 */

import 'regenerator-runtime/runtime';
/**
 * regenerator-runtime is a library that provides polyfills for async/await and generators.
 */