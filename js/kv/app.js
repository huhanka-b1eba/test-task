
function kvCreateApp(kvDom, kvConfig) {
    const kvState = {
        current: 0,
        transition: null,
        pointerTargetX: 0,
        pointerTargetY: 0,
        pointerX: 0,
        pointerY: 0,
        numberAnchorX: 0,
        numberAnchorY: 0,
        smokeAnchorX: 0,
        smokeAnchorY: 0,
        numberParallaxMix: 1,
        numberParallaxMixTarget: 1,
        smokeParallaxMix: 1,
        smokeParallaxMixTarget: 1
    };

    const kvStage = {
        activeNumber: null,
        currentSmoke: kvDom.smokeBase,
        currentSmokeKey: kvConfig.slides[0].smoke,
        nextSmoke: null,
        nextNumber: null
    };

    function kvApplyNumberTransform(element, slideOffset) {
        const parallaxX = (kvState.pointerX - kvState.numberAnchorX) * kvConfig.parallax.numberX * kvState.numberParallaxMix;
        const parallaxY = (kvState.pointerY - kvState.numberAnchorY) * kvConfig.parallax.numberY * kvState.numberParallaxMix;

        element.style.transform = `translate3d(calc(-50% + ${slideOffset + parallaxX}px), calc(-50% + ${parallaxY}px), 0)`;
    }

    function kvSetNumberState(element, slideOffset, opacity) {
        kvApplyNumberTransform(element, slideOffset);
        element.style.opacity = String(opacity);
    }

    function kvApplySmokeTransform(element, slideOffset, parallaxX = 0, parallaxY = 0) {
        element.style.transform = `translate3d(calc(-50% + ${slideOffset + parallaxX}px), ${parallaxY}px, 0) scale(1.12)`;
    }

    function kvSetSmokeState(element, slideOffset, opacity) {
        const parallaxX = element === kvStage.currentSmoke
            ? (kvState.pointerX - kvState.smokeAnchorX) * kvConfig.parallax.smokeX * kvState.smokeParallaxMix
            : 0;
        const parallaxY = element === kvStage.currentSmoke
            ? (kvState.pointerY - kvState.smokeAnchorY) * kvConfig.parallax.smokeY * kvState.smokeParallaxMix
            : 0;

        kvApplySmokeTransform(element, slideOffset, parallaxX, parallaxY);
        element.style.opacity = String(opacity);
    }

    function kvGetSmokeTravelDistance(direction, smokeRect) {
        const margin = 48;
        const kvRect = kvDom.root.getBoundingClientRect();

        if (direction > 0) {
            const distanceToRight = kvRect.right - smokeRect.left;
            return Math.max(distanceToRight + margin, kvRect.width * 0.75);
        }

        const distanceToLeft = smokeRect.right - kvRect.left;
        return Math.max(distanceToLeft + margin, kvRect.width * 0.75);
    }

    function kvResetBackground() {
        kvDom.bgMain.style.opacity = "1";
        kvDom.bgMain.style.transform = "translate3d(0, 0, 0) scaleX(1)";
        kvDom.bgMain.style.filter = "none";

        kvDom.bgNext.style.opacity = "0";
        kvDom.bgNext.style.transform = "translate3d(0, 0, 0) scaleX(1)";
        kvDom.bgNext.style.filter = "none";

        kvDom.bgGradientOverlay.style.opacity = "0";
        kvDom.bgGradientOverlay.style.transform = "translate3d(0, 0, 0) scaleX(1)";
        kvDom.bgGradientOverlay.style.filter = "none";
        kvDom.bgGradientOverlay.style.backgroundPosition = "50% 50%";
    }

    function kvSetupTransition(direction) {
        const nextIndex = direction === 1
            ? (kvState.current + 1) % kvConfig.slides.length
            : (kvState.current - 1 + kvConfig.slides.length) % kvConfig.slides.length;

        const nextSlide = kvConfig.slides[nextIndex];
        const currentSlide = kvConfig.slides[kvState.current];

        const gradientKey = `${currentSlide.key}->${nextSlide.key}`;
        kvDom.bgGradientOverlay.style.background = kvConfig.gradients[gradientKey] || kvConfig.gradients["slide1->slide2"];
        kvDom.bgNext.src = nextSlide.bg;

        const currentSmokeParallaxX = (kvState.pointerX - kvState.smokeAnchorX) * kvConfig.parallax.smokeX * kvState.smokeParallaxMix;
        const currentSmokeParallaxY = (kvState.pointerY - kvState.smokeAnchorY) * kvConfig.parallax.smokeY * kvState.smokeParallaxMix;
        kvApplySmokeTransform(kvStage.currentSmoke, 0, currentSmokeParallaxX, currentSmokeParallaxY);
        kvStage.currentSmoke.style.opacity = "1";

        const smokeRectStart = kvStage.currentSmoke.getBoundingClientRect();
        const smokeTravelDistance = kvGetSmokeTravelDistance(direction, smokeRectStart);

        kvStage.nextNumber = kvCreateNumber(nextSlide.numbers);
        kvDom.numbersWrapper.appendChild(kvStage.nextNumber);
        kvSetNumberState(kvStage.nextNumber, direction * kvDom.numbersWrapper.clientWidth, 1);

        kvStage.nextSmoke = kvCreateSmoke(nextSlide.smoke);
        kvDom.smokeWrapper.appendChild(kvStage.nextSmoke);
        kvSetSmokeState(kvStage.nextSmoke, -direction * smokeTravelDistance, 0);

        kvState.numberParallaxMix = 0;
        kvState.numberParallaxMixTarget = 0;
        kvState.smokeParallaxMix = 0;
        kvState.smokeParallaxMixTarget = 0;

        kvState.transition = {
            start: performance.now(),
            direction,
            from: kvState.current,
            to: nextIndex,
            smokeTravelDistance,
            smokeStartX: currentSmokeParallaxX,
            smokeStartY: currentSmokeParallaxY
        };
    }

    function kvRenderBackground(progress, direction) {
        const stretch = kvEaseInOutCubic(progress);
        const swap = kvEaseOutQuint(kvSegment(progress, kvConfig.timings.bgSwapStart, 1));

        const mainTranslate = kvMix(0, direction * 42, stretch);
        const mainScaleX = kvMix(1, 4.4, stretch);
        const mainOpacity = kvMix(1, 0, Math.pow(stretch, 1.15));

        const nextReveal = kvSegment(progress, kvConfig.timings.bgSwapStart, 1);
        const nextTranslate = kvMix(-direction * 42, 0, swap);
        const nextScaleX = kvMix(4.4, 1, swap);
        const nextOpacity = nextReveal;

        const gradientOpacity = Math.sin(Math.PI * kvSegment(progress, 0.48, 0.96)) * 0.95;
        const gradientScaleX = kvMix(1.1, 2.8, kvSegment(progress, 0.36, 0.82));
        const gradientTranslate = kvMix(direction * 14, -direction * 8, kvSegment(progress, 0.4, 1));

        kvDom.bgMain.style.opacity = String(mainOpacity);
        kvDom.bgMain.style.transform = `translate3d(${mainTranslate}%, 0, 0) scaleX(${mainScaleX})`;
        kvDom.bgMain.style.filter = `brightness(${kvMix(1, 0.68, stretch)})`;

        kvDom.bgNext.style.opacity = String(nextOpacity);
        kvDom.bgNext.style.transform = `translate3d(${nextTranslate}%, 0, 0) scaleX(${nextScaleX})`;
        kvDom.bgNext.style.filter = `brightness(${kvMix(0.72, 1, nextReveal)}) saturate(${kvMix(1.08, 1, nextReveal)})`;

        kvDom.bgGradientOverlay.style.opacity = String(Math.max(gradientOpacity, 0));
        kvDom.bgGradientOverlay.style.transform = `translate3d(${gradientTranslate}%, 0, 0) scaleX(${gradientScaleX})`;
        kvDom.bgGradientOverlay.style.backgroundPosition = `${50 + direction * kvMix(-18, 16, progress)}% 50%`;
    }

    function kvRenderText(progress, direction) {
        const totalOffset = kvDom.numbersWrapper.clientWidth;
        const move = kvEaseOutQuint(kvSegment(progress, kvConfig.timings.textHold, 1));

        const outgoingOffset = kvMix(0, -direction * totalOffset, move);
        const incomingOffset = kvMix(direction * totalOffset, 0, move);

        kvSetNumberState(kvStage.activeNumber, outgoingOffset, 1);
        kvSetNumberState(kvStage.nextNumber, incomingOffset, 1);
    }

    function kvRenderSmoke(progress, direction) {
        const totalOffset = kvState.transition.smokeTravelDistance;
        const smokeOut = kvSegment(progress, 0, kvConfig.timings.smokeOutEnd);
        const smokeIn = kvEaseOutQuint(kvSegment(progress, kvConfig.timings.smokeInStart, 1));

        const outgoingOffset = kvMix(
            kvState.transition.smokeStartX,
            kvState.transition.smokeStartX + direction * totalOffset,
            smokeOut
        );
        const outgoingY = kvState.transition.smokeStartY;
        const incomingOffset = kvMix(-direction * totalOffset, 0, smokeIn);

        kvApplySmokeTransform(kvStage.currentSmoke, outgoingOffset, 0, outgoingY);
        const outgoingOpacity = progress <= kvConfig.timings.smokeOutEnd
            ? 1
            : 1 - kvSegment(progress, kvConfig.timings.smokeOutEnd, kvConfig.timings.smokeInStart);
        kvStage.currentSmoke.style.opacity = String(Math.max(0, Math.min(1, outgoingOpacity)));

        if (progress < kvConfig.timings.smokeInStart) {
            kvSetSmokeState(kvStage.nextSmoke, -direction * totalOffset, 0);
        } else {
            kvSetSmokeState(kvStage.nextSmoke, incomingOffset, 1);
        }
    }

    function kvFinishTransition() {
        kvState.current = kvState.transition.to;

        kvStage.activeNumber.remove();
        kvStage.activeNumber = kvStage.nextNumber;
        kvStage.nextNumber = null;
        kvSetNumberState(kvStage.activeNumber, 0, 1);

        if (kvStage.currentSmoke && kvStage.currentSmoke.parentNode) {
            kvStage.currentSmoke.remove();
        }

        kvStage.currentSmoke = kvStage.nextSmoke;
        kvStage.nextSmoke = null;
        kvStage.currentSmoke.style.opacity = "1";
        kvSetSmokeState(kvStage.currentSmoke, 0, 1);

        kvDom.bgMain.src = kvConfig.slides[kvState.current].bg;
        kvResetBackground();

        kvState.numberAnchorX = kvState.pointerX;
        kvState.numberAnchorY = kvState.pointerY;
        kvState.smokeAnchorX = kvState.pointerX;
        kvState.smokeAnchorY = kvState.pointerY;

        kvState.numberParallaxMixTarget = 1;
        kvState.smokeParallaxMixTarget = 1;
        kvState.transition = null;
    }

    function kvAnimate(now) {
        kvState.pointerX += (kvState.pointerTargetX - kvState.pointerX) * 0.08;
        kvState.pointerY += (kvState.pointerTargetY - kvState.pointerY) * 0.08;
        kvState.numberParallaxMix += (kvState.numberParallaxMixTarget - kvState.numberParallaxMix) * 0.08;
        kvState.smokeParallaxMix += (kvState.smokeParallaxMixTarget - kvState.smokeParallaxMix) * 0.08;

        if (kvState.transition) {
            const progress = kvClamp(
                (now - kvState.transition.start) / kvConfig.timings.duration,
                0,
                1
            );

            kvRenderBackground(progress, kvState.transition.direction);
            kvRenderText(progress, kvState.transition.direction);
            kvRenderSmoke(progress, kvState.transition.direction);

            if (progress >= 1) {
                kvFinishTransition();
            }
        } else {
            kvSetNumberState(kvStage.activeNumber, 0, 1);
            kvSetSmokeState(kvStage.currentSmoke, 0, 1);
        }

        requestAnimationFrame(kvAnimate);
    }

    function kvStartTransition(direction) {
        if (kvState.transition) {
            return;
        }

        kvSetupTransition(direction);
    }

    function kvBindEvents() {
        window.addEventListener("mousemove", (event) => {
            kvState.pointerTargetX = event.clientX / window.innerWidth - 0.5;
            kvState.pointerTargetY = event.clientY / window.innerHeight - 0.5;
        });

        window.addEventListener("mouseleave", () => {
            kvState.pointerTargetX = 0;
            kvState.pointerTargetY = 0;
            kvState.numberAnchorX = 0;
            kvState.numberAnchorY = 0;
            kvState.smokeAnchorX = 0;
            kvState.smokeAnchorY = 0;
        });

        kvDom.prevBtn.addEventListener("click", () => {
            kvStartTransition(-1);
        });

        kvDom.nextBtn.addEventListener("click", () => {
            kvStartTransition(1);
        });
    }

    function kvExposeDebug() {
        window.__kvSmokeDebug = {
            getState() {
                const currentRect = kvStage.currentSmoke.getBoundingClientRect();
                const nextRect = kvStage.nextSmoke ? kvStage.nextSmoke.getBoundingClientRect() : null;
                return {
                    transitionActive: Boolean(kvState.transition),
                    currentSlide: kvState.current,
                    currentSmoke: {
                        opacity: kvStage.currentSmoke.style.opacity,
                        transform: kvStage.currentSmoke.style.transform,
                        rect: {
                            left: Number(currentRect.left.toFixed(2)),
                            right: Number(currentRect.right.toFixed(2)),
                            width: Number(currentRect.width.toFixed(2))
                        }
                    },
                    nextSmoke: kvStage.nextSmoke
                        ? {
                            opacity: kvStage.nextSmoke.style.opacity,
                            transform: kvStage.nextSmoke.style.transform,
                            rect: {
                                left: Number(nextRect.left.toFixed(2)),
                                right: Number(nextRect.right.toFixed(2)),
                                width: Number(nextRect.width.toFixed(2))
                            }
                        }
                        : null
                };
            }
        };
    }

    function kvInit() {
        kvPreloadSlides(kvConfig.slides);

        kvStage.activeNumber = kvCreateNumber(kvConfig.slides[0].numbers);

        kvDom.smokeBase.dataset.offsetX = "0";
        kvDom.smokeBase.dataset.offsetY = "0";
        kvDom.smokeBase.style.opacity = "1";

        kvDom.smokeWrapper.style.animation = "none";
        kvDom.smokeWrapper.style.opacity = "1";
        kvDom.smokeWrapper.style.transform = "none";

        kvDom.numbersWrapper.innerHTML = "";
        kvDom.numbersWrapper.appendChild(kvStage.activeNumber);
        kvSetNumberState(kvStage.activeNumber, 0, 1);

        kvResetBackground();
        kvBindEvents();
        kvExposeDebug();
        requestAnimationFrame(kvAnimate);
    }

    return {
        kvInit,
        kvStartTransition,
        kvGetState() {
            return kvState;
        }
    };
}

window.kvCreateApp = kvCreateApp;
