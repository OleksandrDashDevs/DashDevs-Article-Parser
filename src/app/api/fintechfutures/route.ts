import { chromium } from 'playwright';
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { articleParse } from "@/app/helpers/articleParse";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ success: false, message: "URL is required" }, { status: 400 });
        }
        
        const browser = await chromium.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();

        await page.setExtraHTTPHeaders({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        });

        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const htmlContent = await page.content();
        await browser.close();

        const $ = cheerio.load(htmlContent);
        
        const articleContent = $(".ContentModule-Wrapper"); 

        if (!articleContent.length) {
            console.warn("Article content not found. Спробуй інший селектор.");
            return NextResponse.json({ success: false, message: "article-content not found" }, { status: 404 });
        }

        const title = $(".ArticleBase-LargeTitle").first().text().trim();
        if (!title) {
            console.warn("H1 title not found");
            return NextResponse.json({ success: false, message: "H1 title not found" }, { status: 404 });
        }

        const rawDate = $("p.Contributors-Date, .post-date").first().text().trim() || "";
        let date = "";
        if (rawDate) {
            const parsedDate = new Date(rawDate);
            if (!isNaN(parsedDate.getTime())) date = parsedDate.toISOString();
        }

        const displayUrl = (() => {
            try { return new URL(url).hostname.replace(/^www\./, ""); } 
            catch { return url; }
        })();

        const frontMatter = `---
linktitle: "${title}"
image_preview: ""
date: ${date}
tags: []
seo_description: ""
seo_keywords: ""
---`;

        const contentMarkdown = articleParse($, articleContent);
        const finalDoc = `${frontMatter}\n# ${title}\n\n${contentMarkdown}\n\n[${displayUrl}](${url})`;

        return NextResponse.json({
            success: true,
            message: "Article parsing was successful.",
            markdown: finalDoc,
            title,
            date,
        });

    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json({ success: false, message: "An error occurred during parsing." }, { status: 500 });
    }
}