window.kvConfig = {
    slides: [
        {
            key: "slide1",
            bg: "assets/kv/slide1/bg.png",
            numbers: "assets/kv/slide1/text.png",
            smoke: "assets/kv/slide1/smoke.png"
        },
        {
            key: "slide2",
            bg: "assets/kv/slide2/bg.png",
            numbers: "assets/kv/slide2/text.png",
            smoke: "assets/kv/slide2/smoke.png"
        },
        {
            key: "slide3",
            bg: "assets/kv/slide3/bg.png",
            numbers: "assets/kv/slide3/text.png",
            smoke: "assets/kv/slide3/smoke.png"
        }
    ],
    gradients: {
        "slide1->slide2": "linear-gradient(90deg, rgba(215,218,219,0) 8%, rgba(215,218,219,0.56) 30%, rgba(188,145,149,0.88) 50%, rgba(159,54,62,0.72) 68%, rgba(159,54,62,0) 92%)",
        "slide2->slide1": "linear-gradient(90deg, rgba(159,54,62,0) 8%, rgba(159,54,62,0.72) 30%, rgba(188,145,149,0.88) 50%, rgba(215,218,219,0.56) 68%, rgba(215,218,219,0) 92%)",
        "slide2->slide3": "linear-gradient(90deg, rgba(159,54,62,0) 8%, rgba(159,54,62,0.58) 30%, rgba(94,58,78,0.9) 50%, rgba(28,62,94,0.76) 70%, rgba(28,62,94,0) 92%)",
        "slide3->slide2": "linear-gradient(90deg, rgba(28,62,94,0) 8%, rgba(28,62,94,0.76) 30%, rgba(94,58,78,0.9) 50%, rgba(159,54,62,0.58) 68%, rgba(159,54,62,0) 92%)",
        "slide3->slide1": "linear-gradient(90deg, rgba(28,62,94,0) 8%, rgba(28,62,94,0.46) 30%, rgba(122,140,157,0.86) 50%, rgba(215,218,219,0.74) 68%, rgba(215,218,219,0) 92%)",
        "slide1->slide3": "linear-gradient(90deg, rgba(215,218,219,0) 8%, rgba(215,218,219,0.74) 30%, rgba(122,140,157,0.86) 50%, rgba(28,62,94,0.46) 68%, rgba(28,62,94,0) 92%)"
    },
    timings: {
        duration: 1280,
        textHold: 0.38,
        textSwap: 0.64,
        smokeOutEnd: 0.74,
        smokeInStart: 0.82,
        bgSwapStart: 0.62
    },
    parallax: {
        numberX: 18,
        numberY: 6,
        smokeX: 72,
        smokeY: 42
    }
};
