import { chromium } from "playwright";

export const getPageContent = async (url: string) => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector(".ArticleBase-Body", { timeout: 0 });

    const content = await page.content();
    await browser.close();
    return content;
};
