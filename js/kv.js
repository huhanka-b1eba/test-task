document.addEventListener("DOMContentLoaded", () => {
    const kv = document.querySelector(".kv");
    const numbers = document.querySelector(".numbers");
    const smoke = document.querySelector(".smoke");

    setTimeout(() => {
        kv.classList.add("active");
    }, 100);

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    let parallaxFactors = {
        numbers: 40,
        smoke: 80
    };

    function updateParallaxFactors() {
        const width = window.innerWidth;
        const baseMultiplier = width <= 480 ? 0.5 : 1;
        parallaxFactors.numbers = 40 * baseMultiplier;
        parallaxFactors.smoke = 80 * baseMultiplier;
    }

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    window.addEventListener("resize", () => {
        updateParallaxFactors();
    });

    updateParallaxFactors();

    function animate() {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;

        if (numbers) {
            numbers.style.transform = `translate3d(${currentX * parallaxFactors.numbers}px, ${currentY * parallaxFactors.numbers}px, 0)`;
        }
        if (smoke) {
            smoke.style.transform = `translate3d(${currentX * parallaxFactors.smoke}px, ${currentY * parallaxFactors.smoke}px, 0)`;
        }

        requestAnimationFrame(animate);
    }

    animate();
});