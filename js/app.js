"use strict";

//steps: 1- on Click on Add Section button => display dialog box  [done]
//steps: 2- take the form values an turn it into a new section  [done]
//steps: 3- add the new section to the DOM  [done]
//steps: 4- add the new section to the navigation  [done]
//steps: 5- use Intersection observer to scroll smoothly to the section, and add active class to the section and the active    navbar item [done]
//steps: 6- user intersection api to add scroll to top button that scroll back to the top of the page [done]
//steps: 7- make section collapsable to hide the content on button click and reveal the content on button click  [done]
//steps: 8- hide the navbar on stop scrolling  [done]
//steps: 9- make te navbar responsive  [done]

// ---------------------------------------------------------------------------------------
// Global Variables

const btnAddSection = document.getElementById("add");
const modal = document.getElementById("modal");
const btnCloseModal = document.querySelector(".btn__close");
const menuNavBar = document.querySelector(".navbar__menu");
const menuList = document.querySelector(".navbar__menu ul");

//select the exsiting Section
const sections = document.querySelectorAll("section");

const btnMenuOpen = document.querySelector(".menu-bars");
const btnMenuClose = document.querySelector(".menu-close");
const btnScrollToTop = document.querySelector(".scroll-to-top");
const btnIcons = document.querySelectorAll("button.icon");
const rootElement = document.documentElement;
const pageHeader = document.querySelector(".page__header");
const main = document.querySelector("main");
let scrollTimeout;

//1-  show and hide modal

btnAddSection.addEventListener("click", function () {
  modal.showModal();
});

btnCloseModal.addEventListener("click", function () {
  modal.close();
});

//TODO: add the logic of when click outside the modal, it will close the modal

const clickOutsideModalFn = function (e) {
  const dialogDimensions = modal.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    modal.close();
  }
};

modal.addEventListener("click", clickOutsideModalFn);

//<li><a class="menu__link" href="#section1">Section 1</a></li>//

//create a new li element

sections.forEach((section) => {
  const id = section.id;
  const dataNav = section.dataset.nav;
  const itemHtml = `<li><a class="menu__link" href="#${id}">${dataNav}</a></li>`;
  menuList.innerHTML += itemHtml;
});

// using getBoundClientRect to observe sections dimensions.
const activateSections = function () {
  //get my scroll position
  const scrollPosition = window.scrollY;

  //get sections dimensions
  sections.forEach((section) => {
    const sectionDimensions = section.getBoundingClientRect();
    //get the distance from the top of the viewport to the top of the section
    const sectionTop = sectionDimensions.top + scrollPosition;
    // the distance from the top of the viewport + the top of the section+ the bottom of the section
    const sectionBottom = sectionTop + sectionDimensions.height;

    if (
      scrollPosition + window.innerHeight / 2 > sectionTop &&
      scrollPosition + window.innerHeight / 2 < sectionBottom
    ) {
      // Remove active class from all sections and nav items
      sections.forEach((section) =>
        section.classList.remove("your-active-class")
      );
      document
        .querySelectorAll(".navbar__menu .menu__link")
        .forEach((link) => link.classList.remove("active__link"));

      // Add active class to current section and corresponding nav item
      section.classList.add("your-active-class");
      const correspondingNavItem = document.querySelector(
        `.navbar__menu .menu__link[href="#${section.id}"]`
      );
      if (correspondingNavItem) {
        correspondingNavItem.classList.add("active__link");
      }
    }
  });
};
window.addEventListener("scroll", activateSections);

//smooth scrolling to the section when click on the navbar
menuList.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("menu__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//----------------------------------------------------------
// Responsive controlling

const controlMenu = function () {
  menuNavBar.classList.toggle("show-nav");
};

btnMenuOpen.addEventListener("click", controlMenu);
btnMenuClose.addEventListener("click", controlMenu);

// Function to add a new section and corresponding nav item
function addNewSection(title, content) {
  // Create new section
  const newSection = document.createElement("section");
  const sectionId = `section${document.querySelectorAll("section").length + 1}`;
  newSection.id = sectionId;
  newSection.setAttribute("data-nav", title);

  newSection.innerHTML = `
    <div class="landing__container">
      <h2>${title}</h2>
      <button class="icon">
            <i class="fa-solid fa-chevron-down fa-xl"></i>
          </button>
      <p>${content}</p>
    </div>
  `;

  // Add new section to the DOM
  document.querySelector("main").appendChild(newSection);

  // Create new nav item
  const newNavItem = document.createElement("li");
  newNavItem.innerHTML = `<a class="menu__link" href="#${sectionId}">${title}</a>`;

  // Add new nav item to the menu
  menuList.appendChild(newNavItem);

  // Observe the new section
  sectionObserver.observe(newSection);
}

// Handle form submission
modal.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = this.querySelector("#section-title").value;
  const content = this.querySelector("#section-content").value;
  addNewSection(title, content);
  modal.close();
  this.reset();
});

// -------------------------------------------------------------------
// showing the scroll to top button

function handleScroll() {
  const scrollTotal = rootElement.scrollHeight - window.innerHeight;
  const scrollPosition = window.scrollY || rootElement.scrollTop;

  if (scrollPosition / scrollTotal > 0.5) {
    btnScrollToTop.classList.add("show-btn");
  } else {
    btnScrollToTop.classList.remove("show-btn");
  }
}

window.addEventListener("scroll", handleScroll);
// scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
btnScrollToTop.addEventListener("click", scrollToTop);

// -------------------------------------------------------------------
// Header visibility control

function showHeader() {
  pageHeader.classList.remove("header-disappear");
}

function hideHeader() {
  //make the header always visible on the top of the page,
  if (window.scrollY > 0) {
    pageHeader.classList.add("header-disappear");
  }
}

window.addEventListener("scroll", () => {
  showHeader();
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(hideHeader, 3000);
});

// Intersection Observer for header the header intersecting with the main sections show the header
const headerObserveFn = function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) showHeader();
  });
};

const headerObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: "-1px 0px 0px 0px",
};

const pageHeaderObserver = new IntersectionObserver(
  headerObserveFn,
  headerObserverOptions
);

pageHeaderObserver.observe(main);
// ---------------------------------------

//folding sections

const foldSectionFn = function (e) {
  const section = e.target.closest("section");
  section.classList.toggle("section-folded");
};

btnIcons.forEach((btn) => btn.addEventListener("click", foldSectionFn));
