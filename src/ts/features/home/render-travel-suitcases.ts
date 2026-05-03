import { renderTravelSuitcaseCard, TravelSuitcaseCardData } from "./render-travel-suitcase-card";

const SLIDER_AUTOPLAY_DELAY = 4600;

const travelSuitcaseTexts: Array<Pick<TravelSuitcaseCardData, "title" | "text">> = [
  {
    title: "Weekend escapes start here.",
    text: "Compact silhouettes and sturdy shells fit quick weekend city breaks.",
  },
  {
    title: "Ready for long-haul routes.",
    text: "Roomy interiors keep the essentials organized from departure to arrival.",
  },
  {
    title: "Built for every itinerary.",
    text: "Protective finishes and flexible packing space support trips of any pace.",
  },
  {
    title: "Travel lighter, move faster.",
    text: "Balanced handles and spinner wheels make terminals easier to cross.",
  },
];

const travelSuitcaseCards: TravelSuitcaseCardData[] = [
  {
    imageUrl: "/assets/images/home/suitcase-real-live.png",
  },
  {
    imageUrl: "/assets/images/home/suitcase-real-live-1.png",
  },
  {
    imageUrl: "/assets/images/home/suitcase-real-live-2.png",
  },
  {
    imageUrl: "/assets/images/home/suitcase-real-live-3.png",
  },
];

function getShuffledTexts(): Array<Pick<TravelSuitcaseCardData, "title" | "text">> {
  const texts = [...travelSuitcaseTexts];

  for (let index = texts.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [texts[index], texts[randomIndex]] = [texts[randomIndex], texts[index]];
  }

  return texts;
}

function getSliderCards(): TravelSuitcaseCardData[] {
  const texts = getShuffledTexts();
  const sliderCards = [...travelSuitcaseCards, ...travelSuitcaseCards];

  return sliderCards.map((card, index) => ({
    ...card,
    ...texts[index % texts.length],
  }));
}

function getVisibleSlides(slider: HTMLElement): number {
  const visibleSlides = Number(
    window.getComputedStyle(slider).getPropertyValue("--travel-slides-visible"),
  );

  return Number.isFinite(visibleSlides) && visibleSlides > 0 ? visibleSlides : 1;
}

function getSliderGap(track: HTMLElement): number {
  return Number(window.getComputedStyle(track).columnGap.replace("px", "")) || 0;
}

function initTravelSuitcasesSlider(section: HTMLElement): void {
  const slider = section.querySelector<HTMLElement>("[data-travel-slider]");
  const track = section.querySelector<HTMLElement>("[data-travel-track]");
  const previousButton = section.querySelector<HTMLButtonElement>("[data-travel-prev]");
  const nextButton = section.querySelector<HTMLButtonElement>("[data-travel-next]");
  const dots = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-travel-dot]"));
  const slides = Array.from(section.querySelectorAll<HTMLElement>(".travel-suitcase-card"));

  if (!slider || !track || !previousButton || !nextButton || slides.length === 0) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentIndex = 0;
  let autoplayId: number | undefined;

  const getMaxIndex = (): number => Math.max(slides.length - getVisibleSlides(slider), 0);

  const updateSlider = (): void => {
    const maxIndex = getMaxIndex();
    const visibleSlides = getVisibleSlides(slider);
    const slideWidth = slides[0]?.getBoundingClientRect().width ?? 0;
    const slideOffset = slideWidth + getSliderGap(track);

    currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
    track.style.transform = `translate3d(-${currentIndex * slideOffset}px, 0, 0)`;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxIndex;

    slides.forEach((slide, index) => {
      const isVisible = index >= currentIndex && index < currentIndex + visibleSlides;
      slide.setAttribute("aria-hidden", String(!isVisible));
    });

    dots.forEach((dot, index) => {
      const isAvailable = index <= maxIndex;
      const isActive = index === currentIndex;

      dot.hidden = !isAvailable;
      dot.classList.toggle("travel-suitcases-slider__dot--active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const goToSlide = (index: number): void => {
    currentIndex = index;
    updateSlider();
  };

  const goToNextSlide = (): void => {
    const maxIndex = getMaxIndex();
    goToSlide(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  const stopAutoplay = (): void => {
    if (typeof autoplayId !== "number") {
      return;
    }

    window.clearInterval(autoplayId);
    autoplayId = undefined;
  };

  const startAutoplay = (): void => {
    if (prefersReducedMotion || slides.length <= getVisibleSlides(slider) || typeof autoplayId === "number") {
      return;
    }

    autoplayId = window.setInterval(goToNextSlide, SLIDER_AUTOPLAY_DELAY);
  };

  previousButton.addEventListener("click", () => {
    goToSlide(currentIndex <= 0 ? getMaxIndex() : currentIndex - 1);
    stopAutoplay();
    startAutoplay();
  });

  nextButton.addEventListener("click", () => {
    goToNextSlide();
    stopAutoplay();
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      stopAutoplay();
      startAutoplay();
    });
  });

  slider.addEventListener("pointerenter", stopAutoplay);
  slider.addEventListener("pointerleave", startAutoplay);
  slider.addEventListener("focusin", stopAutoplay);
  slider.addEventListener("focusout", (event) => {
    if (!slider.contains(event.relatedTarget as Node | null)) {
      startAutoplay();
    }
  });
  window.addEventListener("resize", updateSlider);

  updateSlider();
  startAutoplay();
}

export function renderTravelSuitcases(): HTMLElement {
  const section = document.createElement("section");
  section.className = "travel-suitcases";
  const sliderCards = getSliderCards();

  section.innerHTML = `
    <div class="travel-suitcases__header">
      <h2 class="travel-suitcases__heading">Travel suitcases</h2>
      <p class="travel-suitcases__copy">Duis vestibulum elit vel neque pharetra</p>
    </div>

    <div class="travel-suitcases-slider" aria-label="Travel suitcase images" data-travel-slider>
      <button class="travel-suitcases-slider__control travel-suitcases-slider__control--prev" type="button" aria-label="Previous suitcase image" data-travel-prev>
        <span aria-hidden="true">&lsaquo;</span>
      </button>
      <div class="travel-suitcases-slider__viewport">
        <div class="travel-suitcases-grid" data-travel-track></div>
      </div>
      <button class="travel-suitcases-slider__control travel-suitcases-slider__control--next" type="button" aria-label="Next suitcase image" data-travel-next>
        <span aria-hidden="true">&rsaquo;</span>
      </button>
      <div class="travel-suitcases-slider__dots" aria-label="Choose suitcase slide">
        ${sliderCards.map((_, index) => `
          <button class="travel-suitcases-slider__dot" type="button" aria-label="Show suitcase slide ${index + 1}" data-travel-dot></button>
        `).join("")}
      </div>
    </div>
  `;

  const track = section.querySelector<HTMLElement>("[data-travel-track]");

  track?.append(...sliderCards.map(renderTravelSuitcaseCard));
  initTravelSuitcasesSlider(section);

  return section;
}
