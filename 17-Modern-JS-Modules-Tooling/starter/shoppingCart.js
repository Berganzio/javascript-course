// Exporting module

console.log('Exporting module');

const shippingCost = 10;
const cart = [];

export const addToCart = function(product, quantity) {
    cart.push({product, quantity});
    console.log(`${quantity} ${product} added to cart`);
};

const totalPrice = 237;
const totalQuantity = 23;

export {totalPrice, totalQuantity as quantity};

// default export
export default function(product, quantity) {
    cart.push({product, quantity});
    console.log(`${quantity} ${product} added to cart`);
}

const add = (product, quantity) => {
    cart.push({product, quantity});
    console.log(`${quantity} ${product} added to cart`);
};

export {add as addToCartAlias, cart};


    