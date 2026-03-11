function kvGetDom() {
    return {
        root: document.querySelector(".kv"),
        bgMain: document.querySelector(".bg-main"),
        bgNext: document.querySelector(".bg-next"),
        bgGradientOverlay: document.querySelector(".bg-gradient-overlay"),
        numbersWrapper: document.querySelector(".numbers-wrapper"),
        smokeWrapper: document.querySelector(".smoke-wrapper"),
        smokeBase: document.querySelector(".smoke"),
        prevBtn: document.querySelector(".kv-prev"),
        nextBtn: document.querySelector(".kv-next")
    };
}

window.kvGetDom = kvGetDom;
