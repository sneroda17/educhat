console.log(`
MMMMMMMMMMMMO$7IIIIIIIII7$ONMMMMMMMMMMMM
MMMMMMMMNZ7IIIIIIIIIIIIIIIII7ZNMMMMMMMMM
MMMMMMMZIIIIIIIIIIIIIIIIIIIIIII7MMMMMMMM
MMMMN$IIIIIIIIIIIIIIIIIIIIIIIIIII$NMMMMM
MMMMIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOMMMM
MMN7IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIINMMM
MD7IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII7DMM
D7IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII7NM
$IIIIIIIIIIIIIII~,   .~+IIIIIIIIIIIIII$M
IIIIIIIIIIII~,.         .,~?IIIIIIIIIII8
IIIIIIII=,.                 .,=?IIIIIII$
IIIIIIII+:..               ..:+IIIIIIII7
IIIIIIIII?.=.             .?IIIIIIIIIII7
IIIIIIIII?.=.             ,?IIIIIIIIIII7
IIIIIIIII+.=.             .?IIIIIIIIIIIO
7IIIIIII=...I=:.........:=IIIIIIIIIIII7N
8IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII8M
MOIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOMM
MM8IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII8MMM
MMMDIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII7MMMM
MMMMO7IIIIIIIIIIIIIIIIIIIIIIIIIII78MMMMM
MMMMMM87IIIIIIIIIIIIIIIIIIIIIIII8MMMMMMM
MMMMMMMMZ7IIIIIIIIIIIIIIIIIIII7DMMMMMMMM
MMMMMMMMMMMD7IIIIIIIIIIIIIII7DMMMMMMMMMM
MMMMMMMMMMMMMMMN88O7IIIIIII$MMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMOIIIII$NMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMM8IIIINMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMDII$NMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMN$NMMMMMMMMMMMMMMMMMM`, "\nWe're hiring! https://edu.chat/carreers");


var topButton = document.querySelector("#top-button");
var header = document.querySelector("#header");
var learnMore = document.querySelector("#learn-more");
var whyEduChat = document.querySelector("#why-container");

var handleTopButtonVisibility = function () {
  var y = window.scrollY;
  if (y >= header.clientHeight) {
    topButton.style.display = "inline";
  } else {
    topButton.style.display = "none";
  }
};

function scrollToTop(scrollDuration) {
  var scrollStep = -window.scrollY / (scrollDuration / 15),
    scrollInterval = setInterval(function () {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else 
        clearInterval(scrollInterval);
      }
    , 15);
}

function scrollToItem(item) {
  var diff = (item.offsetTop - window.scrollY) / 8
  if (Math.abs(diff) > 1) {
    window.scrollTo(0, (window.scrollY + diff))
    clearTimeout(window._TO)
    window._TO = setTimeout(scrollToItem, 30, item)
  } else {
    window.scrollTo(0, item.offsetTop)
  }
}

topButton
  .addEventListener("click", function () {
    scrollToTop(300);
  });
if (learnMore) {
  learnMore
    .addEventListener("click", function () {
      scrollToItem(whyEduChat);
    });
}
window.addEventListener("scroll", handleTopButtonVisibility);

/* Hamburger Menu */
var isHamburgerOn = false;
var hamburgerMenu = document.querySelector("#menu-mobile");
var navMenu = document.querySelector("#nav");

hamburgerMenu.addEventListener("click", function () {
  if (isHamburgerOn) {
    navMenu.style.display = "none";
  } else {
    navMenu.style.display = "block";
  }
  isHamburgerOn = !isHamburgerOn;
});