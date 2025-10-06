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

        const articleContent = data(".main__content__wrapper");
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
        const rawDate = data("p.post__date").text().trim() || "";
        let date = "";

        if (rawDate) {
            try {
                const parsedDate = new Date(rawDate);

                if (!isNaN(parsedDate.getTime())) {
                    date = parsedDate.toISOString();
                } else {
                    console.warn("Could not parse date:", rawDate);
                }
            } catch (e) {
                console.error("Date parsing error:", e);
            }
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
