import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
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

    let browser = null;
    try {
        const executablePath = await chromium.executablePath();
        browser = await puppeteer.launch({
            executablePath,
            args: chromium.args,
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });
        const html = await page.content();
        const $ = cheerio.load(html);

        const articleContent = $(".ArticleBase-Body");
        if (!articleContent.length) {
            return NextResponse.json(
                { success: false, message: "article-content not found" },
                { status: 404 },
            );
        }

        const h1 = $("h1.ArticleBase-HeaderTitle").first();
        const title = h1
            .find('span[data-testid="article-title"]')
            .first()
            .text()
            .trim();
        const rawDate = $("p.Contributors-Date").text().trim() || "";
        const date = rawDate ? new Date(rawDate).toISOString() : "";

        const frontMatter = `---\nlinktitle: "${title}"\nimage_preview: ""\ndate: ${date}\ntags: []\nseo_description: ""\nseo_keywords: ""\n---`;

        const contentMarkdown = articleParse($, articleContent);
        const finalDoc = `${frontMatter}# ${title}\n\n${contentMarkdown}\n\nWebsite: [${url}](${url})`;

        return NextResponse.json({
            success: true,
            message: "Парсинг успішний",
            markdown: finalDoc,
            title,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Помилка при парсингу" },
            { status: 500 },
        );
    } finally {
        if (browser) await browser.close();
    }
}
