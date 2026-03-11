document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("sequence-canvas");
    const ctx = canvas.getContext("2d");

    const frameCount = 24;
    const images = [];
    let rafId = null;

    const currentFrame = (index) =>
        `assets/frames/frame-${String(index + 1).padStart(3, "0")}.jpg`;

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.onload = () => {
            updateFrame();
        };
        img.src = currentFrame(i);
        img.loading = "eager";
        images.push(img);
    }

    function resizeCanvas() {
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight;

        canvas.style.width = `${viewportWidth}px`;
        canvas.style.height = `${viewportHeight}px`;
        canvas.width = viewportWidth;
        canvas.height = viewportHeight;

        updateFrame();
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    function render(index) {
        const img = images[index];
        if (!img.complete) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth;
        let drawHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
        } else {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgRatio;
            offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }

    function updateFrame() {
        const scrollTop = window.scrollY;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const safeMaxScroll = Math.max(maxScroll, 1);

        const scrollFraction = scrollTop / safeMaxScroll;

        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );

        render(frameIndex);
    }

    window.addEventListener("scroll", () => {
        if (rafId !== null) {
            return;
        }

        rafId = requestAnimationFrame(() => {
            rafId = null;
            updateFrame();
        });
    });

    updateFrame();

});
