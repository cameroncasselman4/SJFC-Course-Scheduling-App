let mainNav = document.getElementById('js-menu');

let navBarToggle = document.getElementById('js-navbar-toggle');

navBarToggle.addEventListener('click', function () {

  mainNav.classList.toggle('active');
});

// // When the user scrolls the page, execute myFunction 
// window.onscroll = function() {staticNav()};

// // Get the navbar
// var navbar = document.querySelector(".navbar");
// console.log(navbar);
// // Get the offset position of the navbar
// var sticky = navbar.offsetTop;
// // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
// function staticNav() {
//     console.log(sticky);
//     if (window.pageYOffset >= sticky) {
//         navbar.classList.add("sticky")
//     } 
//     else {
//         navbar.classList.remove("sticky");
//     }
// }
/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.querySelector(".navbar").style.top = "0";
  } else {
    document.querySelector(".navbar").style.top = "-50px";
  }
  prevScrollpos = currentScrollPos;
};