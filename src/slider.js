import Swiper from "swiper";
import { Pagination, Autoplay, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/parallax";
export const createSwiper = (settings) => {
  const interleaveOffset = 1;
  const prevBtns = document.querySelectorAll(
    `${settings?.className} .main-slider__prev`
  );
  const nextBtns = document.querySelectorAll(
    `${settings?.className} .main-slider__next`
  );
  settings.autoplay = true;

  Swiper.use([Pagination, Parallax]);

  if (settings.autoplay) {
    Swiper.use([Autoplay]);
  }
  const slides = document.querySelectorAll("swiper-slide");
  const swOptions = {
    ...settings.options,
    threshold: 3,
    speed: 1000,
    effect: "fade",
    watchSlidesProgress: true,
    fadeEffect: {
      crossFade: true,
    },
    autoplay: {
      delay: 5000,
    },
    pagination: {
      el: `${settings.className} .main-slider__pagination`,
      type: "bullets",
      bulletClass: "main-slider__pagination-bullet",
      bulletActiveClass: "main-slider__pagination-bullet--active",
      clickable: true,
    },
    parallax: true, // Включаем параллакс
    on: {
      slideChange: (swiper) => {
        prevBtns?.forEach((prevBtn) => {
          prevBtn.disabled = swiper.isBeginning;
        });
      },
      progress: (swiper) => {
        for (let i = 0; i < swiper?.slides.length; i++) {
          const slide = swiper.slides[i];
          const slideProgress = slide.progress;
          const innerOffset = swiper?.width * interleaveOffset;
          const innerTranslate = slideProgress * innerOffset;
          const inner = slide.querySelector(".slider-section__slide");

          if (inner) {
            inner.style.transform =
              "translate3d(" + innerTranslate + "px, 0, 0)";
          }
        }
      },
      touchStart: (swiper) => {
        for (let i = 0; i < swiper?.slides.length; i++) {
          const slide = swiper.slides[i];

          slide.style.transition = "";
        }
      },
      setTransition: (swiper, transition) => {
        for (let i = 0; i < swiper?.slides.length; i++) {
          const slide = swiper.slides[i];
          slide.style.transition = transition + "ms";
          const inner = slide.querySelector(".slider-section__slide");

          if (inner) {
            inner.style.transition = transition + "ms";
          }
        }
      },
    },
  };

  const sw = new Swiper(settings.el, swOptions);

  prevBtns.forEach((prevBtn) => {
    prevBtn?.addEventListener("click", () => {
      sw.slidePrev();
    });
  });
  nextBtns.forEach((nextBtn) => {
    nextBtn?.addEventListener("click", () => {
      sw.slideNext();
    });
  });

  return sw;
};
createSwiper({
  className: ".main-slider",
});
const el = document.querySelector(".main-slider");

if (el) {
  const sw = createSwiper({
    el,
    className: ".main-slider",
  });

  sw.on("slideChange", (s) => {
    const video = s.slides[s.realIndex].querySelector(`video`);
    const currentSlide = s.slides[s.realIndex];
    const paginationContainer = document.querySelector(
      ".main-slider__pagination"
    );

    if (currentSlide.classList.contains("black-theme")) {
      paginationContainer.classList.add("black-theme");
      paginationContainer.classList.remove("white-theme");
    } else if (currentSlide.classList.contains("white-theme")) {
      paginationContainer.classList.add("white-theme");
      paginationContainer.classList.remove("black-theme");
    } else {
      paginationContainer.classList.add("black-theme");
      paginationContainer.classList.remove("white-theme");
    }
    if (video) {
      video?.play();
    }
  });

  sw.on("beforeSlideChangeStart", (s) => {
    const video = s.slides[s.realIndex].querySelector(`video`);
    if (video) {
      video?.pause();
    }
  });
}
