'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//for (let i = 0; i < btnsOpenModal.length; i++)
//btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// even if btnsOpenModal is a node list, we can use forEach method on it

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
///////////////////////////////////////

// Selecting elements
console.log(document.documentElement); // the entire HTML document
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header'); // select the first element with class header
const allSections = document.querySelectorAll('.section'); // select all elements with class section
console.log(allSections);

document.getElementById('section--1'); // select element with id section--1
const alltab = document.getElementsByTagName('button'); // select all elements with tag button
console.log(alltab); // returns a HTML collection, not a node list, live collection
// HTML collection is updated automatically when the DOM changes

console.log(document.getElementsByClassName('btn')); // select all elements with class btn

// Creating and inserting elements
// .insertAdjacentHTML is a method of the string prototype (not a DOM method)

const message = document.createElement('div'); // create a DOM element
message.classList.add('cookie-message'); // add a class to the element
// message.textContent = 'We use cookies for improved functionality and analytics.'; // add text to the element
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>'; // add HTML to the element
// header.prepend(message); // prepend the element to the header (first child)
header.append(message); // append the element to the header (last child)
// header.append(message.cloneNode(true)); // append a copy of the element to the header (last child)
// header.before(message); // insert the element before the header (sibling)
// header.after(message); // insert the element after the header (sibling)

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove(); // remove the element (newer method)
    message.parentElement.removeChild(message); // remove the element (older method), DOM traversing
  });

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height); // returns nothing, because it's not an inline style
console.log(message.style.backgroundColor); // returns the color in rgb format

console.log(getComputedStyle(message).color); // returns the color in rgb format
console.log(getComputedStyle(message).height); // returns the height in px format

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'; // get the height, convert it to a number, add 30px and convert it back to a string

document.documentElement.style.setProperty('--color-primary', 'limegreen'); // set a CSS variable

// Attributes

// we have this HTML
// <img src="img/logo.png" alt="Bankist logo" class="nav__logo" designer="Jonas Schmedtmann" data-version-number="3.0">
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // returns the value of the alt attribute
console.log(logo.src); // returns the value of the src attribute
console.log(logo.className); // returns the value of the class attribute
console.log(logo.designer); // returns undefined, because it's not a standard attribute
console.log(logo.getAttribute('designer')); // returns the value of the designer attribute

logo.alt = 'Beautiful minimalist logo'; // set the value of the alt attribute
console.log(logo.alt); // returns the value of the alt attribute

console.log(logo.getAttribute('src')); // returns the value of the src attribute
console.log(logo.src); // returns the link to the src attribute

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // returns the link to the href attribute
console.log(link.getAttribute('href')); // returns the value of the href attribute that in this case this is a hyperlink:
// NOTE:
// Hyperlinks are the primary method for navigating between pages and to parts within the pages.
// The <a> tag defines a hyperlink, which is used to link from one page to another.
// The most important attribute of the <a> element is the href attribute, which indicates the link's destination.
// By default, links will appear as follows in all browsers:
// An unvisited link is underlined and blue
// A visited link is underlined and purple
// An active link is underlined and red

// Data attributes
console.log(logo.dataset.versionNumber); // returns the value of the data-version-number attribute
// remember: data attributes are always converted to camelCase so if we have data-version-number it will be versionNumber. "data" is not included in the name because it's a reserved word (like class)

// Classes
logo.classList.add('c', 'j', 'k'); // add classes c and j to the element
logo.classList.remove('c', 'j'); // remove classes c and j from the element, if there is no class c or j, nothing happens
logo.classList.toggle('t'); // if the element has class c, remove it, if it doesn't have it, add it
console.log(logo.classList.contains('t')); // returns true if the element has class c, false if it doesn't have it

// NOTE: Don't use
// logo.className = 'jonas'; // this will overwrite the entire class list of the element with the class jonas (bad practice)

// add to "open account" button the class "highlight"
// Select the element
const openAccount = document.querySelector(
  '.nav__link.nav__link--btn.btn--show-modal'
);

// Remove the old class and add the new one
// Select the element
const element = document.querySelector(
  '.nav__link.nav__link--btn.btn--show-modal'
);
// Remove the old class and add the new one
element.classList.remove('nav__link--btn', 'btn--show-modal');
element.classList.add('highlight');

// function to scroll to the coordinates of the element
const scrollerCoords = function (section) {
  // add event listener to the element
  const sCoords = section.getBoundingClientRect(); // get the coordinates of the element
  console.log(sCoords); // returns the coordinates of the element
  console.log('Current scroll (X/Y)', window.window.scrollX, window.scrollY); // returns the current scroll position
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); // returns the height/width of the viewport

  // Scrolling the old way
  // CODE:
  // window.scrollTo(
  //   sCoords.left + window.scrollX,
  //   sCoords.top + window.scrollY
  // ); // scroll to the coordinates of the element (absolute position)

  // window.scrollTo({
  //   left: sCoords.left + window.scrollX,
  //   top: sCoords.top + window.scrollY,
  //   behavior: 'smooth',
  // }); // scroll to the coordinates of the element with smooth behavior

  // Scrolling the new way
  section1.scrollIntoView({ behavior: 'smooth' }); // scroll to the element with smooth behavior
};
/////////////////////////////////////
// NOTE:
// IN THIS PIECE OF CODE WE HAVE 3 LINKS AND 3 SECTIONS
// WE ASSIGN THE EVENT LISTENER TO EACH OF THEM BUT WE CAN DO BETTER:
// WE CAN SIMPLY SELECT "nav--links" AND USE THE THIS KEYWORD TO REFER TO THE ELEMENT THAT THE EVENT HANDLER IS ATTACHED TO

// CODE:
// const btnScrollTo = document.querySelector('.btn--scroll-to'); // button "Learn more ⬇️"
// const featuresLink = document.querySelector('.nav__link[href="#section--1"]'); // link "Features"
// const operationsLink = document.querySelector('.nav__link[href="#section--2"]'); // link "Operations"
// const testimonialsLink = document.querySelector(
//   '.nav__link[href="#section--3"]'
// ); // link "Testimonials"
// const section1 = document.querySelector('#section--1');
// const section2 = document.querySelector('#section--2');
// const section3 = document.querySelector('#section--3');
//
// btnScrollTo.addEventListener('click', function (e) {
//   scrollerCoords(section1);
// });
//
// featuresLink.addEventListener('click', function (event) {
//   event.preventDefault();
//   document.querySelector('#section--1').scrollIntoView({ behavior: 'smooth' });
// });
//
// operationsLink.addEventListener('click', function (event) {
//   event.preventDefault();
//   document.querySelector('#section--2').scrollIntoView({ behavior: 'smooth' });
// });
//
// testimonialsLink.addEventListener('click', function (event) {
//   event.preventDefault();
//   document.querySelector('#section--3').scrollIntoView({ behavior: 'smooth' });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); // prevent the default behavior of the link

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); // get the href attribute of the link
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); // scroll to the element with smooth behavior
  }
});
// NOTE:
// this is called event delegation: we put the event listener on a parent element and then we use the target element to determine where the event happened
/////////////////////////////////////

// types of events and event handlers
const h1 = document.querySelector('h1'); // select the h1 element

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
  h1.removeEventListener('mouseenter', alertH1); // remove the event listener
};

h1.addEventListener('mouseenter', alertH1); // add the event listener

// CODE:
// setTimeout(function () {
//   h1.removeEventListener('mouseenter', alertH1); // remove the event listener after 3 seconds
// }, 3000);

// .onmouseenter is a property of the h1 element
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };

// Event propagation: bubbling and capturing
// NOTE:
// bubbling: when an event happens on an element, it first runs the handlers on it, then on its parent, then all the way up on other ancestors
// capturing: the event goes down to the element

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min); // random integer between min and max

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`; // random color

document.querySelector('.nav__link').addEventListener('click', function (e) {
  console.log('LINK', e.target, e.currentTarget); // e.target is the element that the event happened on, e.currentTarget is the element that the event handler is attached to
  console.log(e.currentTarget === this); // true

  // e.stopPropagation(); // stop bubbling
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    console.log('NAV', e.target, e.currentTarget);
    console.log(e.currentTarget === this);
  }
  // true // true means that the event handler is attached to the capturing phase, default is false
);

// DOM traversing
// const h1 = document.querySelector('h1'); // select the h1 element

// Going downwards: child
console.log(h1.querySelectorAll('.highlight')); // returns all the elements with class highlight inside the h1 element
console.log(h1.childNodes); // returns all the child nodes of the h1 element
console.log(h1.children); // returns all the child elements of the h1 element
h1.firstChild; // returns the first child node of the h1 element
h1.firstElementChild; // returns the first child element of the h1 element
h1.firstElementChild.style.color = 'darkgrey'; // set the color of the first child element of the h1 element to white
h1.lastElementChild.style.color = 'orangered'; // set the color of the last child element of the h1 element to white

// Going upwards: parents
console.log(h1.parentNode); // returns the parent node of the h1 element
console.log(h1.parentElement); // returns the parent element of the h1 element

// h1.closest('.header').style.background = 'var(--gradient-secondary)'; // returns the closest parent element with class header of the h1 element, in this case the h1 element itself

// h1.closest('h1').style.background = 'var(--gradient-primary)'; // returns the closest parent element with tag h1 of the h1 element, in this case the h1 element itself

// Going sideways: siblings
console.log(h1.previousElementSibling); // returns the previous sibling element of the h1 element
console.log(h1.nextElementSibling); // returns the next sibling element of the h1 element

console.log(h1.previousSibling); // returns the previous sibling node of the h1 element
console.log(h1.nextSibling); // returns the next sibling node of the h1 element

console.log(h1.parentElement.children); // returns all the child elements of the parent element of the h1 element, not an array but a HTML collection
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.animate(
      [
        { outline: '0px solid rgba(0, 0, 0, 0)' },
        { outline: '5px solid black' },
        { outline: '0px solid rgba(0, 0, 0, 0)' },
      ],
      {
        // animation options
        duration: 5000, // duration of the animation in milliseconds
        easing: 'ease-in-out', // easing function for the animation
      }
    );
  }
});

// Select all tab, tabContents and tabContainer elements
const tab = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');
const tabContainer = document.querySelector('.operations__tab-container');

// Add event listener to the tabContainer element (event delegation) and use the target element to determine where the event happened
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // returns the closest parent element with class operations__tab of the element that was clicked
  if (!clicked) return; // if there is no element with class operations__tab return to avoid errors
  tab.forEach(t => t.classList.remove('operations__tab--active')); // remove the class operations__tab--active from all the elements with class operations__tab
  tabContents.forEach(c => c.classList.remove('operations__content--active')); // remove the class operations__content--active from all the elements with class operations__content
  clicked.classList.add('operations__tab--active'); // add the class operations__tab--active to the element that was clicked
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`) // select the element with class operations__content--${clicked.dataset.tab}
    .classList.add('operations__content--active'); // add the class operations__content--active to the element with class operations__content--${clicked.dataset.tab}
});

// menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; // select the element that the event happened on
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); // select all the elements with class nav__link inside the closest parent element with class nav
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // set the opacity of the element to 0.5
    });
  }
};

// add event listener to the nav element and pass an argument to the event handler with bind method
nav.addEventListener('mouseover', handleHover.bind(0.5)); // add the event listener with the opacity of 0.5
nav.addEventListener('mouseout', handleHover.bind(1)); // add the event listener with the opacity of 1

// sticky navigation
const initialCoords = section1.getBoundingClientRect(); // get the coordinates of the element
console.log(initialCoords); // returns the coordinates of the element

// add event listener to the window element (bad performance, especially on mobile devices)
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky'); // add the class sticky to the nav element
//   else nav.classList.remove('sticky'); // remove the class sticky from the nav element
// });

// sticky navigation: intersection observer API (better performance)
const navHeight = nav.getBoundingClientRect().height; // get the height of the nav element
const headerObserver = new IntersectionObserver(
  function (entries) {
    const [entry] = entries; // entries[0]
    if (!entry.isIntersecting)
      nav.classList.add('sticky'); // add the class sticky to the nav element
    else nav.classList.remove('sticky'); // remove the class sticky from the nav element
  }
  // {
  //   root: null, // the element that is used as the viewport for checking visibility of the target. Must be the ancestor of the target. Defaults to the browser viewport if not specified or if null
  //   threshold: 0, // the percentage of the target element which is visible
  //   rootMargin: `-${navHeight}px`, // margin around the root. Values are similar to the CSS margin property
  // }
);
headerObserver.observe(header); // observe the header element

// reveal sections
const allSectionsObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries; // entries[0]
    if (!entry.isIntersecting) return; // if the element is not intersecting return
    entry.target.classList.remove('section--hidden'); // remove the class section--hidden from the element
    observer.unobserve(entry.target); // stop observing the element for performance reasons
  },
  {
    root: null, // the element that is used as the viewport for checking visibility of the target. Must be the ancestor of the target. Defaults to the browser viewport if not specified or if null
    threshold: 0.15, // the percentage of the target element which is visible
  }
);
allSections.forEach(function (section) {
  section.classList.add('section--hidden'); // add the class section--hidden to all the elements with class section
  allSectionsObserver.observe(section); // observe all the elements with class section
});

// lazy loading images
// NOTE: lazy loading is a technique that defers the loading of non-essential resources at page load time. Instead, these non-essential resources are loaded at the moment of need.
const imgTargets = document.querySelectorAll('img[data-src]'); // select all the elements with tag img and data-src attribute

const loadImg = function (entries, observer) {
  const [entry] = entries; // entries[0]
  if (!entry.isIntersecting) return; // if the element is not intersecting return
  entry.target.src = entry.target.dataset.src; // set the src attribute of the element to the value of the data-src attribute
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // remove the class lazy-img from the element
  });
  observer.unobserve(entry.target); // stop observing the element for performance reasons
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null, // the element that is used as the viewport for checking visibility of the target. Must be the ancestor of the target. Defaults to the browser viewport if not specified or if null
  threshold: 0, // the percentage of the target element which is visible
  rootMargin: '200px', // margin around the root. Values are similar to the CSS margin property
});

imgTargets.forEach(img => imgObserver.observe(img)); // observe all the elements with tag img and data-src attribute

// slider
const slider = function () {
  const slides = document.querySelectorAll('.slide'); // select all the elements with class slide
  const btnLeft = document.querySelector('.slider__btn--left'); // select the element with class slider__btn--left
  const btnRight = document.querySelector('.slider__btn--right'); // select the element with class slider__btn--right
  let curSlide = 0; // current slide
  const maxSlide = slides.length; // maximum slide

  // functions

  // create dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();

  // activate dots
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active')); // remove the class dots__dot--active from all the elements with class dots__dot
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active'); // add the class dots__dot--active to the element with class dots__dot and data-slide attribute equal to slide
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`) // set the transform property of the element to the value of the translateX property
    );
    activateDot(slide); // call the activateDot function
  };

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
  };

  // previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
  };

  // initial position
  goToSlide(0);
  activateDot(0);

  // event handlers
  btnRight.addEventListener('click', nextSlide); // add event listener to the btnRight element
  btnLeft.addEventListener('click', prevSlide); // add event listener to the btnLeft element
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });

  // keyboard events
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide(); // if the key is ArrowLeft call the prevSlide function
    e.key === 'ArrowRight' && nextSlide(); // if the key is ArrowRight call the nextSlide function
  });
};

slider(); // call the slider function

// lifecycle DOM events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); // prevent the default behavior of the event
//   console.log(e);
//   e.returnValue = ''; // Chrome requires this line
// });