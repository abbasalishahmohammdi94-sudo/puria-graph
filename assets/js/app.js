const counters = document.querySelectorAll(".stat h3");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = entry.target;
      const target = Number(counter.dataset.target);

      let current = 0;

      const duration = 2000;
      const stepTime = duration / target;

      const interval = setInterval(() => {
        current++;

        counter.textContent = current + "+";

        if (current >= target) {
          clearInterval(interval);
        }
      }, stepTime);

      observer.unobserve(counter);
    });
  },
  {
    threshold: 0.6,
  },
);

counters.forEach((counter) => {
  observer.observe(counter);
});



// سوایپر


const portfolioSwiper = new Swiper(".portfolioSwiper", {
loop: true,

grabCursor: true,
allowTouchMove: true,

navigation: {
nextEl: ".swiper-button-next",
prevEl: ".swiper-button-prev",
},

autoplay: {
delay: 4000,
disableOnInteraction: false,
},

pagination: {
el: ".swiper-pagination",
clickable: true,
},
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

console.log("MENU:", menuToggle);
console.log("NAV:", navLinks);

menuToggle.addEventListener("click", () => {

  console.log("CLICKED!");

  navLinks.classList.toggle("active");

  console.log(navLinks.classList);
});