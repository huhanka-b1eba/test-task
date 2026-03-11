function kvClamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function kvMix(from, to, progress) {
    return from + (to - from) * progress;
}

function kvSegment(progress, start, end) {
    if (progress <= start) {
        return 0;
    }

    if (progress >= end) {
        return 1;
    }

    return (progress - start) / (end - start);
}

function kvEaseInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function kvEaseOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
}

window.kvClamp = kvClamp;
window.kvMix = kvMix;
window.kvSegment = kvSegment;
window.kvEaseInOutCubic = kvEaseInOutCubic;
window.kvEaseOutQuint = kvEaseOutQuint;
