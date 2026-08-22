// ==================================================
// COUNTERS
// ==================================================

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

// ==================================================
// SWIPER
// ==================================================

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

// ==================================================
// MOBILE MENU
// ==================================================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

console.log("MENU:", menuToggle);
console.log("NAV:", navLinks);

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    console.log("CLICKED!");

    navLinks.classList.toggle("active");

    console.log(navLinks.classList);
  });
}

// ==================================================
// BACK TO TOP
// ==================================================

const backToTop = document.getElementById("backToTop");

function checkScroll() {
  const scrollPosition = window.scrollY;

  // از 500px به بعد دکمه نمایش داده شود
  if (backToTop) {
    if (scrollPosition >= 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }
}

// ==================================================
// SCROLL EVENT
// ==================================================

window.addEventListener("scroll", checkScroll);

// ==================================================
// RESIZE EVENT
// ==================================================

window.addEventListener("resize", checkScroll);

// ==================================================
// PAGE LOAD
// ==================================================

window.addEventListener("load", checkScroll);

// ==================================================
// BACK TO TOP CLICK
// ==================================================

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,

      behavior: "smooth",
    });
  });
}

// ==================================================
// INITIAL CHECK
// ==================================================

checkScroll();

document.addEventListener("DOMContentLoaded", async () => {

    const portfolioWrapper =
        document.getElementById("portfolio-wrapper");

    if (!portfolioWrapper) {
        return;
    }


    // ==================================================
    // آدرس Worker
    // ==================================================

    const API_URL =
        "https://admin-pg-git.natanzcity-official.workers.dev/";


    try {

        // ==================================================
        // دریافت تصاویر
        // ==================================================

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "خطا در ارتباط با Worker"
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !Array.isArray(data.images)
        ) {

            throw new Error(
                "اطلاعات تصاویر معتبر نیست."
            );

        }


        // ==================================================
        // ساخت اسلایدها
        // ==================================================

        portfolioWrapper.innerHTML = "";


        data.images.forEach(
            (image, index) => {

                const slide =
                    document.createElement("div");


                slide.className =
                    "swiper-slide";


                const img =
                    document.createElement("img");


                img.src =
                    image.url;


                img.alt =
                    `پروژه ${index + 1}`;


                img.loading =
                    index === 0
                        ? "eager"
                        : "lazy";


                img.decoding =
                    "async";


                slide.appendChild(img);


                portfolioWrapper.appendChild(
                    slide
                );

            }
        );


        // ==================================================
        // اگر هیچ تصویری نبود
        // ==================================================

        if (
            data.images.length === 0
        ) {

            portfolioWrapper.innerHTML = `
                <div class="portfolio-empty">
                    هنوز پروژه‌ای اضافه نشده.
                </div>
            `;

            return;

        }


        // ==================================================
        // Swiper
        // ==================================================

        new Swiper(
            ".portfolioSwiper",
            {

                slidesPerView: 1,

                spaceBetween: 0,

                centeredSlides: false,

                loop:
                    data.images.length > 1,

                grabCursor: true,

                watchOverflow: true,


                navigation: {

                    nextEl:
                        ".portfolioSwiper .swiper-button-next",

                    prevEl:
                        ".portfolioSwiper .swiper-button-prev"

                },


                pagination: {

                    el:
                        ".portfolioSwiper .swiper-pagination",

                    clickable: true

                },


                autoplay: {

                    delay: 4000,

                    disableOnInteraction: false

                }

            }
        );


        console.log(
            `✅ ${data.images.length} پروژه دریافت شد.`
        );


    } catch (error) {

        console.error(
            "❌ Portfolio Error:",
            error
        );

    }

});