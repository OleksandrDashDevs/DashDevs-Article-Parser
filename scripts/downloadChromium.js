const chromium = require("@sparticuz/chromium");

(async () => {
    console.log("Downloading Chromium for Vercel...");
    await chromium.executablePath();
    console.log("Chromium downloaded.");
})();
