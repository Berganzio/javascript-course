'use strict';

// boilerplate for constructor function
const Person = function (fullName, birthYear) {
  // Instance properties
  this.fullName = fullName;
  this.birthYear = birthYear;

  // Never do this
  // this.calcAge = function () {
  //   console.log(2037 - this.birthYear);
  // };
};

const jonas = new Person('Jonas', 1991);
console.log(jonas);

// 1. New {} is created
// 2. Function is called, this = {}
// 3. {} linked to prototype
// 4. Function automatically return {}

const matilda = new Person('Matilda', 2017);
const jack = new Person('Jack', 1975);
console.log(matilda, jack);

console.log(jonas instanceof Person);

// Prototypes
console.log(Person.prototype);

Person.prototype.calcAge = function () {
  console.log(2037 - this.birthYear);
};

jonas.calcAge();
matilda.calcAge();

console.log(jonas.__proto__);
console.log(jonas.__proto__ === Person.prototype);

console.log(Person.prototype.isPrototypeOf(jonas));
console.log(Person.prototype.isPrototypeOf(matilda));

console.log(Person.prototype.isPrototypeOf(Person)); // false
console.log(Object.prototype.isPrototypeOf(Person)); // true

Person.prototype.species = 'Homo Sapiens';
console.log(jonas.species, matilda.species);

console.log(jonas.__proto__);
console.log(jonas.__proto__.__proto__);
console.log(jonas.__proto__.__proto__.__proto__);

console.dir(Person.prototype.constructor);

const arr = [3, 4, 5, 6, 7, 8, 9, 5, 6, 3, 2];
console.log(arr.__proto__); // return all the methods of the Array class
console.log(arr.__proto__ === Array.prototype); // true

Array.prototype.unique = function () {
  return [...new Set(this)]; // unique values
};

console.log(arr.unique());

////////////////////////////////////
// Coding Challenge #1

/* 
1. Use a constructor function to implement a Car. A car has a make and a speed property. The speed property is the current speed of the car in km/h;
2. Implement an 'accelerate' method that will increase the car's speed by 10, and log the new speed to the console;
3. Implement a 'brake' method that will decrease the car's speed by 5, and log the new speed to the console;
4. Create 2 car objects and experiment with calling 'accelerate' and 'brake' multiple times on each of them.

DATA CAR 1: 'BMW' going at 120 km/h
DATA CAR 2: 'Mercedes' going at 95 km/h
*/

const Car = function (manufacturer, speed) {
  this.manufacturer = manufacturer;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(
    `the ${this.manufacturer} speed is increasing at ${this.speed} km/h`
  );
};

Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(
    `the ${this.manufacturer} speed is decreasing at ${this.speed} km/h`
  );
};

const car1 = new Car('BMW', 120);
const car2 = new Car('Mercedes', 95);

car1.accelerate();
car2.accelerate();
car1.brake();
car2.accelerate();
/////////////////////////////////////

// ES6 Classes
// class expression
// const PersonCl = class {}

// class declaration
class PersonCl {
  constructor(fullName, birthYear) {
    this.fullName = fullName;
    this.birthYear = birthYear;
  }

  // Methods will be added to .prototype property
  calcAge() {
    console.log(2037 - this.birthYear);
  }

  greet() {
    console.log(`Hey ${this.fullName}`);
  }

  get age() {
    return 2037 - this.birthYear;
  }

  // Set a property that already exists
  set fullName(name) {
    if (name.includes(' ')) this._fullName = name;
    // _fullName is a convention to indicate that is a private property and should not be accessed from outside
    else alert(`${name} is not a full name`);
  }

  get fullName() {
    return this._fullName;
  }

  // Static method
  static hey() {
    console.log('Hey there 👋👋');
  }
}

const jessica = new PersonCl('Jessica Davis', 1996);
console.log(jessica);
jessica.calcAge();
console.log(jessica.age);
jessica.greet();

console.log(jessica.__proto__ === PersonCl.prototype);

// 1. Classes are NOT hoisted
// 2. Classes are first-class citizens
// 3. Classes are executed in strict mode

const walter = new PersonCl('Walter White', 1965);

PersonCl.hey();
// walter.hey(); // error because hey is a static method and can't be called on an instance

// Setters and Getters
const account = {
  owner: 'jonas',
  movements: [200, 530, 120, 300],

  get latest() {
    return this.movements.slice(-1).pop(); // return the last element of the array
  },

  set latest(mov) {
    this.movements.push(mov);
  },
};

console.log(account.latest);
account.latest = 50; // notice that doesn't call account.latest(50)
console.log(account.movements);
console.log(account.latest);

// Object.create
const PersonProto = {
  calcAge() {
    console.log(2037 - this.birthYear);
  },

  init(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  },
};

const steven = Object.create(PersonProto);
console.log(steven);
steven.name = 'Steven'; // this is not the best way to do it
steven.birthYear = 2002; // this is not the best way to do it
steven.calcAge();

console.log(steven.__proto__ === PersonProto);

const sarah = Object.create(PersonProto);
sarah.init('Sarah', 1979); // this is the best way to do it
sarah.calcAge();

///////////////////////////////////////
// Coding Challenge #2

/* 
1. Re-create challenge 1, but this time using an ES6 class;
2. Add a getter called 'speedUS' which returns the current speed in mi/h (divide by 1.6);
3. Add a setter called 'speedUS' which sets the current speed in mi/h (but converts it to km/h before storing the value, by multiplying the input by 1.6);
4. Create a new car and experiment with the accelerate and brake methods, and with the getter and setter.

DATA CAR 1: 'Ford' going at 120 km/h
*/

class CarClass {
  constructor(manufacturer, speed) {
    this.manufacturer = manufacturer;
    this.speed = speed;
  }

  get speedUS() {
    return this.speed / 1.6;
  }

  /**
   * @param {number} speed - The speed in US units.
   */
  set speedUS(speed) {
    this.speed = speed * 1.6;
  }

  accelerate() {
    this.speed += 10;
    console.log(`the ${this.manufacturer} speed is ${this.speed} km/h`);
  }

  brake() {
    this.speed -= 5;
    console.log(`the ${this.manufacturer} speed is ${this.speed} km/h`);
  }
}

const ford = new CarClass('Ford', 120);
console.log(ford.speedUS);
ford.accelerate();
ford.brake();
ford.speedUS = 50;
console.log(ford);
//////////////////////////////////

// Inheritance Between "Classes": Constructor Functions

const Human = function (firstName, birthYear) {
  this.firstName = firstName;
  this.birthYear = birthYear;
};

Human.prototype.calcAge = function () {
  console.log(2037 - this.birthYear);
};

const Student = function (firstName, birthYear, course) {
  Human.call(this, firstName, birthYear); // this is the same as super()
  this.course = course;
};

// Linking prototypes
Student.prototype = Object.create(Human.prototype); // this is the same as extends
// Student.prototype = Human.prototype; // this is not the same as extends
// this is because if we change the prototype of Student, we also change the prototype of Human

Student.prototype.introduce = function () {
  console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const mike = new Student('Mike', 2020, 'Computer Science');
mike.introduce();
mike.calcAge();

console.log(mike.__proto__);
console.log(mike.__proto__.__proto__);

console.log(mike instanceof Student); // true
console.log(mike instanceof Human); // true because of the prototype chain
console.log(mike instanceof Object); // true because of the prototype chain

Student.prototype.constructor = Student;
console.dir(Student.prototype.constructor); // now it points to Student

/* this phenomenon is called prototype chain
mike -> Student.prototype -> Human.prototype -> Object.prototype

However sometimes we want the constructor to point to the Student constructor
and not to the Human constructor also. This can be prevented by setting the constructor
property of the prototype of Student to Student
*/

///////////////////////////////////////
// Coding Challenge #3

/* 
1. Use a constructor function to implement an Electric Car (called EV) as a CHILD "class" of Car. Besides a make and current speed, the EV also has the current battery charge in % ('charge' property);
2. Implement a 'chargeBattery' method which takes an argument 'chargingPercentage' and sets the battery charge to 'chargeTo';
3. Implement an 'accelerate' method that will increase the car's speed by 20, and decrease the charge by 1%. Then log a message like this: 'Tesla going at 140 km/h, with a charge of 22%';
4. Create an electric car object and experiment with calling 'accelerate', 'brake' and 'chargeBattery' (charge to 90%). Notice what happens when you 'accelerate'! HINT: Review the definiton of polymorphism 😉

DATA CAR 1: 'Tesla' going at 120 km/h, with a charge of 23%
*/

const EV = function (manufacturer, speed, charge) {
  Car.call(this, manufacturer, speed);
  this.charge = charge;
};

EV.prototype = Object.create(Car.prototype);

EV.prototype.chargeBattery = function (chargingPercentage) {
  this.charge = chargingPercentage;
};

EV.prototype.accelerate = function () {
  this.speed += 20;
  this.charge -= 1;
  console.log(
    `the ${this.manufacturer} speed is ${this.speed} km/h, with a charge of ${this.charge}%`
  );
};

const tesla = new EV('Tesla', 120, 23);
tesla.accelerate();
tesla.brake();
tesla.chargeBattery(90);
tesla.accelerate();
///////////////////////////////////////

// Inheritance Between "Classes": ES6 Classes
class HumanCl {
  constructor(fullName, birthYear) {
    this.fullName = fullName;
    this.birthYear = birthYear;
  }

  calcAge() {
    console.log(2037 - this.birthYear);
  }

  greet() {
    console.log(`Hey ${this.fullName}`);
  }

  get age() {
    return 2037 - this.birthYear;
  }
}

class StudentCl extends HumanCl {
  constructor(fullName, birthYear, course) {
    // Always needs to happen first!
    super(fullName, birthYear);
    this.course = course;
  }

  introduce() {
    console.log(`My name is ${this.fullName} and I study ${this.course}`);
  }

  // Overwriting the method from the parent class
  calcAge() {
    console.log(
      `I'm ${2037 - this.birthYear}, but as a student I feel more like ${
        2037 - this.birthYear + 10
      }`
    );
  }
}

const martha = new StudentCl('Martha Jones', 2012, 'Computer Science');

martha.introduce();
martha.calcAge();
martha.greet();

// Inheritance Between "Classes": Object.create

const HumanProto = {
  calcAge() {
    console.log(2037 - this.birthYear);
  },

  init(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  },
};

const steven2 = Object.create(HumanProto);

const StudentProto = Object.create(HumanProto);
StudentProto.init = function (firstName, birthYear, course) {
  HumanProto.init.call(this, firstName, birthYear);
  this.course = course;
};

StudentProto.introduce = function () {
  console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const jay = Object.create(StudentProto);
jay.init('Jay', 2010, 'Computer Science');
jay.introduce();
jay.calcAge();

// Another Class Example with encapsulation and private methods

class Account {
  // Public fields (instances)
  locale = navigator.language;

  // Private fields (instances), viable through this.#movements
  #movements = [];
  #pin;

  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    this.#pin = pin;

    // Protected property, not really private just a convention
    // this._movements = [];

    // this.locale = navigator.language;

    console.log(`Thanks for opening an account, ${owner}`);
  }

  // Public methods
  getMovements() {
    return this.#movements;
  }

  deposit(val) {
    this.#movements.push(val);
    return this;
  }

  withdraw(val) {
    this.deposit(-val);
    return this;
  }

  // Private methods
  #approveLoan(val) {
    return true;
  }

  requestLoan(val) {
    if (this.#approveLoan(val)) {
      this.deposit(val);
      console.log('Loan approved');
      return this;
    }
  }
}

const acc1 = new Account('Jonas', 'EUR', 1111);

acc1.deposit(250);
acc1.withdraw(140);
acc1.requestLoan(1000);
console.log(acc1.getMovements());
console.log(acc1);
// console.log(acc1.#movements); // error
// console.log(acc1.#pin); // error
// console.log(acc1.#approveLoan(1000)); // error

// Chaining methods: thanks to "return this;" in the methods
acc1.deposit(300).deposit(500).withdraw(35).requestLoan(2500).withdraw(4000);
console.log(acc1.getMovements());

// Coding Challenge #4

/* 
1. Re-create challenge #3, but this time using ES6 classes: create an 'EVCl' child class of the 'CarCl' class
2. Make the 'charge' property private;
3. Implement the ability to chain the 'accelerate' and 'chargeBattery' methods of this class, and also update the 'brake' method in the 'CarCl' class. They experiment with chining!

DATA CAR 1: 'Rivian' going at 120 km/h, with a charge of 23%
*/

class EVCl extends CarClass {
  #charge;
  constructor(manufacturer, speed, charge) {
    super(manufacturer, speed);
    this.#charge = charge;
  }

  accelerate() {
    this.speed += 20;
    this.#charge -= 1;
    console.log(
      `the ${this.manufacturer} speed is increasing at ${this.speed} km/h, with a charge of ${
        this.#charge
      }%`
    );
    return this;
  }

  chargeBattery(chargingPercentage) {
    this.#charge = chargingPercentage;
    return this;
  }

  // Overwriting the method brake from the parent class
  brake() {
    this.speed -= 5;
    console.log(
      `the ${this.manufacturer} speed is decreasing at ${this.speed} km/h`
    );
    return this;
  }
}

const rivian = new EVCl('Rivian', 120, 23);
rivian.accelerate().brake().chargeBattery(90).accelerate();
console.log(rivian);
