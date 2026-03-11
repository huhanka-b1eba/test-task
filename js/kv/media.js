function kvCreateNumber(src) {
    const img = document.createElement("img");
    img.className = "layer numbers";
    img.src = src;
    img.alt = "";
    return img;
}

function kvCreateSmoke(src) {
    const img = document.createElement("img");
    img.className = "layer smoke";
    img.src = src;
    img.alt = "";
    img.style.animation = "none";
    img.style.opacity = "1";
    return img;
}

function kvPreloadSlides(slides) {
    const preloaded = new Set();

    function kvPreloadImage(src) {
        if (!src || preloaded.has(src)) {
            return;
        }

        const img = new Image();
        img.src = src;
        preloaded.add(src);
    }

    slides.forEach((slide) => {
        kvPreloadImage(slide.bg);
        kvPreloadImage(slide.numbers);
        kvPreloadImage(slide.smoke);
    });
}

window.kvCreateNumber = kvCreateNumber;
window.kvCreateSmoke = kvCreateSmoke;
window.kvPreloadSlides = kvPreloadSlides;
