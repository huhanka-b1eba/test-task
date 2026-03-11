document.addEventListener("DOMContentLoaded", () => {
    const kvDom = window.kvGetDom();
    const kvApp = window.kvCreateApp(kvDom, window.kvConfig);
    kvApp.kvInit();
});
