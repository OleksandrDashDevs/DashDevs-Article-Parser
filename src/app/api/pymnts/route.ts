import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";
import { articleParse } from "@/app/helpers/articleParse";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json(
                { success: false, message: "URL is required" },
                { status: 400 },
            );
        }

        const response = await axios.get(url);
        const data = cheerio.load(response.data);

        const articleContent = data("#insertArticle");
        if (!articleContent.length) {
            return NextResponse.json(
                { success: false, message: "article-content not found" },
                { status: 404 },
            );
        }

        const title = articleContent.find("h1").first().text().trim();
        if (!title) {
            return NextResponse.json(
                { success: false, message: "H1 title not found" },
                { status: 404 },
            );
        }

        const spans = data(".post-info-name span");

        let rawDateText = "";
        spans.each((_, el) => {
            const text = data(el).text().trim();
            if (
                /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\b/i.test(
                    text,
                ) &&
                /\b\d{1,2}\b/.test(text) &&
                /\b\d{4}\b/.test(text)
            ) {
                rawDateText = text;
            }
        });

        let date = "";
        if (rawDateText) {
            try {
                const parsedDate = new Date(rawDateText);
                if (!isNaN(parsedDate.getTime())) {
                    date = parsedDate.toISOString().split("T")[0];
                }
            } catch {}
        }

        let displayUrl = url;
        try {
            const { hostname } = new URL(url);
            displayUrl = hostname.replace(/^www\./, "");
        } catch {
            displayUrl = url;
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
        const finalDoc = `${frontMatter}# ${title}\n\n${contentMarkdown}\n\n[${displayUrl}](${url})`;

        return NextResponse.json({
            success: true,
            message: "Article parsing was successful.",
            markdown: finalDoc,
            title,
            date,
        });
    } catch (error: unknown) {
        console.error(error);
        const errorMessage =
            error && typeof error === "object" && "message" in error
                ? (error as { message?: string }).message ||
                  "Error during the parsing process."
                : "Error during the parsing process.";
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 },
        );
    }
}
