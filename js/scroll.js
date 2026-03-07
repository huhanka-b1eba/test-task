document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("sequence-canvas");
    const ctx = canvas.getContext("2d");

    const frameCount = 24;
    const images = [];

    const currentFrame = (index) =>
        `assets/frames/frame-${String(index + 1).padStart(3, "0")}.jpg`;

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        updateFrame();
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    function render(index) {
        const img = images[index];
        if (!img.complete) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    function updateFrame() {
        const scrollTop = window.scrollY;

        const maxScroll = document.body.scrollHeight - window.innerHeight;

        const scrollFraction = scrollTop / maxScroll;

        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );

        render(frameIndex);
    }

    window.addEventListener("scroll", () => {
        requestAnimationFrame(updateFrame)
    })

    images[0].onload = () => {
        render(0)
    }

});