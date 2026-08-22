/* ==================================================
   PURIA GRAPH
   SIMPLE IMAGE PORTFOLIO
================================================== */

/* ==================================================
   MOBILE MENU
================================================== */

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

/* ==================================================
   BACK TO TOP
================================================== */

const backToTop = document.getElementById("backToTop");

function checkScroll() {
  if (!backToTop) {
    return;
  }

  if (window.scrollY >= 500) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}

window.addEventListener("scroll", checkScroll);

window.addEventListener("resize", checkScroll);

checkScroll();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,

      behavior: "smooth",
    });
  });
}

/* ==================================================
   PORTFOLIO
================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  /* ------------------------------------------
           CONTAINER
        ------------------------------------------ */

  const container = document.getElementById("portfolio-container");

  if (!container) {
    return;
  }

  try {
    /* ------------------------------------------
               LOAD JSON
            ------------------------------------------ */

    const response = await fetch("assets/data/portfolio.json");

    if (!response.ok) {
      throw new Error("portfolio.json پیدا نشد!");
    }

    const projects = await response.json();

    if (!Array.isArray(projects)) {
      throw new Error("ساختار JSON اشتباه است!");
    }

    /* ------------------------------------------
               CLEAR
            ------------------------------------------ */

    container.innerHTML = "";

    /* ------------------------------------------
               CREATE SLIDES
            ------------------------------------------ */

    projects.forEach((project) => {
      const slide = document.createElement("div");

      slide.className = "swiper-slide";

      slide.innerHTML = `

                        <div
                            class="portfolio-image-box"
                        >

                            <img
                                src="${project.image}"
                                alt="${project.title || "Puria Graph"}"
                                loading="lazy"
                                decoding="async"
                            >

                        </div>

                    `;

      container.appendChild(slide);
    });

    /* ------------------------------------------
               SWIPER
            ------------------------------------------ */

    new Swiper(".portfolioSwiper", {
      /*
       * فقط یک عکس
       */

      slidesPerView: 1,

      slidesPerGroup: 1,

      spaceBetween: 0,

      /*
       * هیچ کارت کناری
       */

      centeredSlides: false,

      centeredSlidesBounds: false,

      /*
       * Loop فقط اگر
       * بیشتر از یک عکس داریم
       */

      loop: projects.length > 1,

      /*
       * لمس موبایل
       */

      grabCursor: true,

      allowTouchMove: true,

      /*
       * ارتفاع اسلاید
       * خودش با عکس هماهنگ شود
       */

      autoHeight: true,

      /*
       * Navigation
       */

      navigation: {
        nextEl: ".portfolioSwiper .swiper-button-next",

        prevEl: ".portfolioSwiper .swiper-button-prev",
      },

      /*
       * Pagination
       */

      pagination: {
        el: ".portfolioSwiper .swiper-pagination",

        clickable: true,
      },

      /*
       * Autoplay
       */

      autoplay: {
        delay: 4000,

        disableOnInteraction: false,
      },

      /*
       * جلوگیری از
       * نمایش اسلاید اضافی
       */

      watchOverflow: true,

      observer: true,

      observeParents: true,

      updateOnWindowResize: true,
    });

    console.log(`✅ ${projects.length} تصویر ساخته شد.`);
  } catch (error) {
    console.error("❌ خطا در Portfolio:", error);
  }
});
