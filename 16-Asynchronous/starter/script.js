'use strict';
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// IMPORTANT new link for the API
// https://countries-api-836d.onrender.com/countries/
const renderCountry = function (dataCountry, className = '') {
  const html = `
    <article class="country ${className}">
        <img class="country__img" src="${dataCountry.flags.png}" />
        <div class="country__data">
            <h3 class="country__name">${dataCountry.name.common}</h3>
            <h4 class="country__region">${dataCountry.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +dataCountry.population / 1000000
            ).toFixed(1)}M people</p>
            <p class="country__row"><span>📍</span>${dataCountry.capital}</p>
            <p class="country__row"><span>🗣️</span>${Object.values(
              dataCountry.languages
            ).join(', ')}</p>
            <p class="country__row"><span>💰</span>${
              Object.values(dataCountry.currencies)[0].name
            }</p>
            <p class="country__row"><span>🧑‍💼</span>${
              dataCountry.name.official
            }</p>
        </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

/*
const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    renderCountry(data);

    const neighbour = data.borders?.[0];

    if (!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();

    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);

    request2.send();

    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      console.log(data2);

      renderCountry(data2, 'neighbour');
    });
    
  });
};

getCountryData('brazil');
*/

/* one thing about the XMLHttpRequest is that it is not a modern way of doing AJAX calls, it is a bit old and it is not very easy to work with, so we are going to use the fetch API to avoid the so called callback hell */

const getCountryData = function (country) {
  // Country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      console.log(response);

      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);

      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];

      if (!neighbour) throw new Error('No neighbour found!');

      // Country 2
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(response => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);

      return response.json();
    })
    .then(data => renderCountry(data[0], 'neighbour')) // data is response.json()
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      console.error(`Something went wrong 💥💥💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

getCountryData('colombia');

// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474
*/

const whereAmI = function (lat, lon) {
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`
  )
    .then(response => {
      if (!response.ok)
        throw new Error(`Problem with geocoding ${response.status}`);
      return response.json();
    })
    .then(data => {
      const city = data.city;
      const country = data.localityInfo.administrative[0].name;
      console.log(`You are in ${city}, ${country}`);
      getCountryData(country);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

whereAmI(-33.933, 18.474);

/**
 * Promises have a priority in the execution order.
 * They enter in the microservices queue category and this category has priority over
 * the normal JS engine's built-in callback queue.
 * An example can be between promises and timers: if we have a timer
 * set to 0 seconds on one line and a promise on the immediate next line we will see
 * that even if the timer is before the promise, the promise will be printed to the
 * console first because of the priority of the microservice queue.
 */

const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('the lottery draw is happening');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You win!');
    } else {
      reject(new Error('You lost everything'));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.
*/

function createImage(imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      document.querySelector('.images').appendChild(img);
      resolve(img);
    });

    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
}

// wait function
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

let currentImg;

createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 2 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-3.jpg');
  })
  .then(() => {
    currentImg.style.display = 'none';
    console.log('Image 3 loaded');
  })
  .then(() => {
    console.log('All images loaded');
  })
  .catch(err => {
    console.error(err);
  });

// async/await
/**
 * async/await is a modern way of handling asynchronous code in JavaScript.
 * It is a syntactic sugar over the promises. Nothing else.
 * It makes the code much easier to read and write.
 * When we type await it is like writing .then() after a promise.
 * The only difference is that we do not concatenate the .then() method to the promise
 * instead we use the await keyword in front of a variable.
 */

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// renderError function
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const whereAmIAsync = async function () {
  // we try to get the position of the user
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lon } = pos.coords;

    // if we get the position we fetch the location data ("await" is used to wait for the promise to be resolved)
    const resGeo = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`
    );
    if (!resGeo.ok) throw new Error('Problem getting location data');

    // if we get the location data we parse it to JSON
    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    // if we get the location data we fetch the country data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.countryName}`
    );
    if (!res.ok) throw new Error('Problem getting country');

    // if we get the country data we parse it to JSON
    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);

    return `You are in ${dataGeo.city}, ${dataGeo.countryName}`;

    // if we get an error we catch it and print it to the console
  } catch (err) {
    console.error(`${err} 💥`);
    renderError(`💥 ${err.message}`);

    // reject promise returned from async function
    throw err;

    // finally we set the opacity of the countries container to 1
  } finally {
    countriesContainer.style.opacity = 1;
  }
};

console.log('1: Will get location');
const city = whereAmIAsync();
console.log(city); // this will print a promise to the console, not the value of the promise

/**
 * here we are going to use the .then() method to get the value of the promise
 * however mixing async/await with .then() is not a good practice
city
  .then(value => console.log(`2: ${value}`)) // this will print the value of the promise to the console
  .catch(err => console.error(`2: ${err.message}`)) // this will print the error to the console
  .finally(() => console.log('3: Finished getting location')); */

// better version
(async function () {
  try {
    const city = await whereAmIAsync();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message}`);
  }
  console.log('3: Finished getting location');
})();

// getJson function
const getJson = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

/**
 * sometimes we dont need to await for a promise to be resolved
 * before we start another one. In this case we can start the
 * promises in parallel. This is called Promise.all()
 * Promise.all() takes an array of promises and returns a new promise
 * In the function below we are going to fetch the data of 3 countries
 * in both ways (using async/await and using Promise.all())
 * To see the difference go to the console->network(fast 3g) and see the
 * time it takes to load the data of the 3 countries with both methods
 * Remember that Promise.all() short circuits if one of the promises is rejected!!!
 */

const get3Countries = async function (c1, c2, c3) {
  try {
    const [data1] = await getJson(`https://restcountries.com/v3.1/name/${c1}`);
    const [data2] = await getJson(`https://restcountries.com/v3.1/name/${c2}`);
    const [data3] = await getJson(`https://restcountries.com/v3.1/name/${c3}`);
    const data = await Promise.all([
      getJson(`https://restcountries.com/v3.1/name/${c1}`),
      getJson(`https://restcountries.com/v3.1/name/${c2}`),
      getJson(`https://restcountries.com/v3.1/name/${c3}`),
    ]);
    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.error(err);
  }
};

setTimeout(() => {
  get3Countries('portugal', 'canada', 'tanzania');
}, 5000);

/**
 * Promise.race() is a method that takes an array of promises and returns a new promise
 * that is settled as soon as one of the input promises is settled.
 * This means that the first settled promise
 * (either resolved or rejected) is the result of the Promise
 * returned from Promise.race()
 */

(async function () {
  const res = await Promise.race([
    getJson(`https://restcountries.com/v3.1/name/italy`),
    getJson(`https://restcountries.com/v3.1/name/canada`),
    getJson(`https://restcountries.com/v3.1/name/mexico`),
  ]);

  console.log(res[0]); // this will print the data of the country that was resolved first
})();

/**
 * Promise.allSettled() is a method that takes an array of promises and returns a new promise
 * that is settled as soon as all of the input promises are settled.
 * This means that the first settled promise
 * (either resolved or rejected) is the result of the Promise
 * returned from Promise.allSettled()
 */

Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
]).then(res => console.log(res));

/**
 * Promise.any() is a method that takes an array of promises and returns a new promise
 * that is settled as soon as one of the input promises is settled.
 * This is a newer method implemented in ES2021.
 * The very difference between Promise.any() and
 * Promise.all() is that Promise.any() continue even if one of the promises is rejected
 */

Promise.any([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
]).then(res => console.log(res));

// Coding Challenge #3

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/

async function loadNPause() {
  try {
    let img = await createImage('img/img-1.jpg');
    console.log('Image 1 loaded');
    await wait(2);
    img.style.display = 'none';
    img = await createImage('img/img-2.jpg');
    console.log('Image 2 loaded');
    await wait(2);
    img.style.display = 'none';
    img = await createImage('img/img-3.jpg');
    console.log('Image 3 loaded');
  } catch (err) {
    console.error(err);
  }
}

// loadNPause();

async function loadAll(imgArr) {
  try {
    const imgs = imgArr.map(async img => await createImage(img));
    console.log(imgs);
    const imgEl = await Promise.all(imgs);
    console.log(imgEl);
    imgEl.forEach(img => img.classList.add('parallel'));
  } catch (err) {
    console.error(err);
  }
}

loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);