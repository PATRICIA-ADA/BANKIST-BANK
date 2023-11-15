'use strict';

///////////////////////////////////////
//SETTING VARIOUS HTML ELEMENTS IN VARIABLES

const imgBlur = document.querySelectorAll('img[data-src]');
//modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//HEADER LINKS
const header = document.querySelector('.header');
const nav =  document.querySelector('.nav');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const parentLink = document.querySelector('.nav__links');
const navLink = document.querySelectorAll('.nav__link');

//TAB BUTTONS & CONTENTS
const tabContainers = document.querySelector('.operations__tab-container');
const tabBtns = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');

//SECTIONS
const allSections = document.querySelectorAll('.section');





///////////////////////////////////////
// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
//old skul way
/* for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal); */

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


///////////////////////////////////////
//PAGE NAVIGATION
/* navLink.forEach(function(link){
  link.addEventListener('click', function(e){
    e.preventDefault();
    const getIDs = this.getAttribute('href');
    console.log(getIDs);
    document.querySelector(getIDs).scrollIntoView({behavior: 'smooth'});
    
  });
}); */
//Event Delegaton method: Efficient use for thousands of page navigation
//1. Add event listener to parent element
//2. Determine what element originated the event.
parentLink.addEventListener('click', function(e){
  e.preventDefault();

  //matching strategy for only interested elements by using e.target this time and not this keyword.
  if(e.target.classList.contains('nav__link')){
    const getIDs = e.target.getAttribute('href');
    document.querySelector(getIDs).scrollIntoView({behavior: 'smooth'});
  }
});


///////////////////////////////////////
//STICKY NAVIGATION
/* const initialCordinates = section1.getBoundingClientRect();
window.addEventListener('scroll', function(){
  if(this.window.scrollY > initialCordinates.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}) */

//new method illustration
/* const obsCallBack = function(entries, observer){
  entries.forEach(entry =>{
    console.log(entry);
  })
};//this callback function here will be called each time that the oberver/target element is intersecting the root element and the threshold that we defined.

const obsOption = {
  root: null,//this is the element that the target is intersecting.it is null bcos we are not interested in the entire viewport.
  threshold: [0, 0.2],//this is the % of the intersection at which the obsCallBack will be called.why we specify 0 is that we want the sticky to happen after the header section
};
const observer = new IntersectionObserver(obsCallBack, obsOption);
observer.observe(section1);//note that the section1 is the target */

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries){
  //lets destructure to get the index of the threshold
  const [entry] = entries;
  //console.log(entry);

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //it doesnt accept rem or % but px only but dont hardcopy the number bcos of responsiveness.
});

headerObserver.observe(header)


///////////////////////////////////////
//REVEAL HIDDEN SECTION using Intersection API
const revealSection = function(entries, observer){
  const [entry] = entries;
  //console.log(entry);
  //guide clause
  if(!entry.isIntersecting) return; //here if it is not intersecting then the remaining of our codes will be executed.

  entry.target.classList.remove('section--hidden') //now we need to know which intersection that actually intersected the viewport, so we use the property'target'. BUT we want to trigger the 'remove' when the target is actually intersecting, let's do that above with if statement.

  observer.unobserve(entry.target) //this will prevent multiple observe displaying in our console
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,//this will reveal when it is 15% visible
});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
});


///////////////////////////////////////
//MENU FADE ANIMATION
//function that fade animation
const mouseHover = function(e){
  console.log(this, e.currentTarget);//by deafult 'this' keyword is the same as the currentTarget, the element on which the event listener is attached to. you can only pass one parameter here (e)
  //match the document
  if(e.target.classList.contains('nav__link')){
    const linkClicked = e.target;//creating a variable which contains the element that we are working with
    const siblings = linkClicked.closest('.nav').querySelectorAll('.nav__link');//we can still use querrySelector to check in for another element.
    const logo = linkClicked.closest('.nav').querySelector('img');

    //decrease opacity
    siblings.forEach(el =>{
      if(el !== linkClicked) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

/* nav.addEventListener('mouseover', function(e){
  mouseHover(e, 0.5);
});//whenever there is a parameter, then it should be a regular function like this.

//Oposite of mouseover
nav.addEventListener('mouseout', function(e){
  mouseHover(e, 1);
}); */ //OR TRY THIS METHOD USING BIND METHOD, which returns new function

//fade out by passing the functon
nav.addEventListener('mouseover', mouseHover.bind(0.5));//we use the bind to pass in more than one argument or can pass as many as you desire into the mouseHover bcos it is impossible to pass two argument/values directly but it only can receive one argument, that is why 'this' keyword is helpful

//return to original fade in
nav.addEventListener('mouseout', mouseHover.bind(1))


///////////////////////////////////////
//SETTING SMOOTH SCROLL TO THE NEXT SECTION
btnScrollTo.addEventListener('click', function(e){
  //get the cordinate of the element you want to scroll to
  const s1cords = section1.getBoundingClientRect(); //this is relative to the viewport, note x is margin from the left of the viewport while y is margin from the top of the viewport btw  where the addEventListner was clicked.
  console.log(s1cords);
  console.log(e.target.getBoundingClientRect());
  //to get the measurement of what we curently scrolled
  console.log(window.pageXOffset, window.pageYOffset);

  //To get the height and width of the current window
  console.log(document.documentElement.clientHeight, document.documentElement.clientWidth);

  //scrolling
  //old skul
  //window.scrollTo(s1cords.left, s1cords.top) //here the top is relative to the size of the viewport, so it wont scroll to the begining of the webpage. so let fix this
  //window.scrollTo(s1cords.left + window.pageXOffset, s1cords.top + window.pageYOffset); //here we added the current position plus the current scroll
  //another old method
  /* window.scrollTo({
    left: s1cords.left + window.pageXOffset, 
    top: s1cords.top + window.pageYOffset,
    behavior: 'smooth',
  }); */

  //new method
  section1.scrollIntoView({behavior: 'smooth'})
});

//////////////////////////////////////
//LOADING BLUR IMAGES
console.log(imgBlur);
const imgLoading = function(entries, observer){
  const [entry] = entries;
  //console.log(entry);

  //guide clause is needed bcos not everything will intersect
  if(!entry.isIntersecting) return;

  //replacing src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });
  //remove observer
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgLoading, {
  root: null,
  threshold: 0,
  rootMargin: '100px', //to load quickly
});

imgBlur.forEach(img => imgObserver.observe(img))



//////////////////////////////////////
//BUILDING A TABBED COMPONENT
//tabBtns.forEach(tab => tab.addEventListener('click', () => console.log('tab'))); //we have a better way to do this to avoid slow down of page when loading thousands of buttons like this
//to solve this we shall use Event Delegation
tabContainers.addEventListener('click', function(e){
e.preventDefault();
const clicked = e.target.closest(' .operations__tab '); //here, it will select the whole element if you click on the span or btn itself
console.log(clicked);

//Guard clause(this will ignore any click around the parent element bcos of the closest())
//old method
/* if(clicked){
  clicked.classList.add('operations__tab--active')
}; */
//new method
if(!clicked) return; //here, if there is no click then return immediately or finish running this function. but if clicked then the rest of the code will run just fine. remember non-falsy will become true and then the code will return and none of the code after it will be executed

//(making the btn bubble up and down)First of all remove the active class from all btns and then add it back to the current click
//Remove active classes of tabBtn & tabContent
tabBtns.forEach(btn => btn.classList.remove('operations__tab--active'));
tabContent.forEach(tabC => tabC.classList.remove('operations__content--active'));
//Activate tab buttons
clicked.classList.add('operations__tab--active');
//Activate tab contents
document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')

});


//////////////////////////////////////
//SLIDER COMPONENT
/* slider.style.transform = 'scale(0.4) translateX(-800px)';
slider.style.overflow = 'visible';
 */
const allSliders = function(){
//SLIDERS & DOTS Elements
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');

//local varaibles
let currentslide = 0;
const maxSlide = slides.length;

//Create Dot slide
const createDots = function(){
  slides.forEach(function(_, i){
    dotContainer.insertAdjacentHTML('beforeend', `<button class ="dots__dot" data-slide= "${i}"></button>`)
  });
};
//createDots();

//activate Dots according to their slide
const activateDot = function(slide){
  //first remove active class
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  //how to select/add the ones that we want/interested on base on date attribute
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};
//activateDot(0);

const gotoSlide = function(slide){
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );//let say currentslide =1: we want it like this -100%, 0%, 100%, 200%
};
//gotoSlide(0)//we have to set the slide to 0 to load first// OR slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`))// 0%, 100%, 200%, 300%

//Next Slide
const nextSlide = function(){
   //this to make the slide not to continue after the last one
   if(currentslide === maxSlide -1){
    currentslide = 0;
  } else{
    currentslide++;
  }
  gotoSlide(currentslide);
  activateDot(currentslide);
};
//Previous slide
const prevSlide = function(){
   //this to make the slide not to continue after the last one
   if(currentslide === 0){
    currentslide = maxSlide -1;
  } else{
    currentslide--;
  }

  gotoSlide(currentslide);
  activateDot(currentslide);
};

const initials = function(){
  gotoSlide(0)//we have to set the slide to 0 to load first// OR slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`))// 0%, 100%, 200%, 300%
  createDots();
  activateDot(0);
};
initials();

//Event handler
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

//to use keyboard keys
document.addEventListener('keydown',function(e){
  if(e.key === 'ArrowLeft') prevSlide();
  e.key ==='ArrowRight' && nextSlide();
});

//for Dots
dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    //destructuring that dataset
    const {slide} = e.target.dataset;
    //get the 'gotoSlide function and pass the destructured dataset 'slide'
    gotoSlide(slide);
    activateDot(slide);

  }
});

};
allSliders();


//LIFECYCLE DOM EVENTS
//DOMContentLoaded
document.addEventListener('DOMContentLoaded', function(e){
  console.log('Html parsed and Dom tree built');
}); //OR
//document.ready is used in vanilla js

//load
window.addEventListener('load', function(e){
  console.log('page fully loaded');
});

//beforeunload, Dont abuse this anyhow
/* window.addEventListener('beforeunload', function(e){
  e.preventDefault();
  console.log(e);
  e.returnValue = '';

}); */












//SELECTING, CREATING AND DELETING ELEMENTS
/* //selecting elements
const header = document.querySelector('.header');
console.log(document.querySelectorAll('.section'));
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);
console.log(document.getElementById('section--1'));
console.log(document.getElementsByClassName('btn'));
console.log(document.getElementsByTagName('button')); */

/* //Creating and inserting elements
//we can use .insertAdjacentHTML() to insert element from html as we did in the bankish App. 
//sometimes, it is good to create the element from scratch by ourselves hereby using other methods as well, okay lets do that now
const message = document.createElement('div');
//add a class to the newly created element
message.classList.add('cookie-message'); */

/* /* //add text to the element
message.textContent = 'We use cookies for imroved functionality and analytics'; */
//let use innerhtml to read and set content
//message.innerHTML = 'We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie"> Got it! </button>' */

//lets put the element in the header
//header.prepend(message);// to add element as the first child (at the top)
//header.append(message);// to add element as the last child (at the buttom)
//header.append(message.cloneNode(true));//with cloneNode(), it means all the child elements will aso be copied. Now, this will then put the cookie message at the top and buttom
//header.before(message);//this will insert the element before the header as a sibling
//header.after(message);//this will insert the element after the header as a sibling

/* //Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', function(){
  message.remove();
  //old skul way
  //message.parentElement.removeChild(message);
}); */

/* //Setting styles
message.style.backgroundColor = '#37383d';
message.style.width = '60%'; */

/* //how to get info that is outside the className or styles that are undefined using computedstyle from the browser
console.log(getComputedStyle(message).height);
//now lets add 40px to the height 
//message.style.height = getComputedStyle(message).height + 40 + 'px'; //here there will be error bcos you cant add numbers to strings but we got you! see below
message.style.height = Number.parseFloat(getComputedStyle(message).height,10) + 40 + 'px'; //the 10 there is the base number  from 0-9 */

//Change CSS custom properties/variable
//document.documentElement.style.setProperty('--color-primary', 'green');

//How to get attributes from html
/* const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.alt);
//reset attribute
logo.alt = 'Small minimalist logo'
console.log(logo); */

//Non standard attributes
/* console.log(logo.designer); //here is undefined
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'New Era Tech'); */

//links attributes
/* const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href')); */

//data attributes
//console.log(logo.dataset.versionNumber);//the data atribute info can be gotten in the dataset object

//classes
/* logo.classList.add('t', 'j');
logo.classList.remove('t', 'b');
logo.classList.toggle('t');
logo.classList.contains('t'); */ //note is diff from includes() as we know in array

/* //TYPES OF EVENTS AND EVENT HANDLER
//How to remove an event listner
const h1 = document.querySelector('h1');
const alertH1 = function(e){
  alert('This is the heading')

  //h1.removeEventListener('mouseenter', alertH1);//mouseenter does not bubble up
};
h1.addEventListener('mouseenter', alertH1);

//setting time
setTimeout(()=> h1.removeEventListener('mouseenter', alertH1),3000); */

//old methodd
/* h1.onmouseenter = function(e){
  alert('This is the heading')
} */


/* //EVENT PROPAGATION: CAPTURING AND BUBBLING

//seting a random color with rgb(255,255,255).
const randomInt = (min, max) => Math.floor(Math.random() * (max-min +1) + min);

const randomColor = () => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;
console.log(randomColor(0,255));

document.querySelector('.nav__link').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor(); 
  //console.log('LINK', e.target, e.currentTarget);
  
  //stop propagation, though dont practise to avoid bugs
  //e.stopPropagation();
  //remember that this keyword points directly to the element on which the EventListner is attached so it is pointing to the link
});
document.querySelector('.nav__links').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  //console.log('CONTAINER', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  //console.log('NAV', e.target, e.currentTarget);
}); */


/* //DOM TRAVERSING(selecting an element based on another element)
const h1 = document.querySelector('h1');

//Going downwards:child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children); //in practise.it return html collection of all child elements.
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'black';

//Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = 'var( --gradient-primary)';
h1.closest('h1').style.background = 'var( --gradient-secondary)';

//Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling); // OR

console.log(h1.previousSibling);
console.log(h1.nextSibling);

//to get all the entire elements of the header
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el){
  if(el !== h1) el.style.transform = 'scale(0.5)';
});
 */