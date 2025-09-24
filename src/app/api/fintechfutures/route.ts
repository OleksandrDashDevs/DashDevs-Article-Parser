import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { articleParse } from "@/app/helpers/articleParse";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { url } = body;

    if (!url) {
        return NextResponse.json(
            { success: false, message: "URL is required" },
            { status: 400 },
        );
    }

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport: { width: 1280, height: 800 },
        });
        const page = await context.newPage();

        await page.goto(url, { waitUntil: "domcontentloaded" });

        const html = await page.content();

        await browser.close();

        const data = cheerio.load(html);

        const articleContent = data(".ArticleBase-Body");

        if (!articleContent.length) {
            return NextResponse.json(
                { success: false, message: "article-content not found" },
                { status: 404 },
            );
        }
        const h1 = data("h1.ArticleBase-HeaderTitle").first();
        const title = h1
            .find('span[data-testid="article-title"]')
            .first()
            .text()
            .trim();
        const rawDate = data("p.Contributors-Date").text().trim() || "";
        let date = "";

        if (rawDate) {
            const parsedDate = new Date(rawDate);
            if (!isNaN(parsedDate.getTime())) date = parsedDate.toISOString();
        }

        const frontMatter = `---
linktitle: "${title}"
image_preview: ""
date: ${date}
tags: []
seo_description: ""
seo_keywords: ""
---
`;

        const contentMarkdown = articleParse(data, articleContent);
        const finalDoc = `${frontMatter}# ${title}\n\n${contentMarkdown}\n\nWebsite: [${url}](${url})`;

        return NextResponse.json({
            success: true,
            message: "Парсинг успішний",
            markdown: finalDoc,
            title,
        });
    } catch (error) {
        if (browser) await browser.close();
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Помилка при парсингу" },
            { status: 500 },
        );
    }
}
