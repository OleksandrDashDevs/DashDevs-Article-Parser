import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";

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
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        const articleContent = $(".article-content");
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

        let image =
            $('meta[property="og:image"]').attr("content") ||
            articleContent.find("img").first().attr("src") ||
            "";

        if (image.startsWith("http")) {
            try {
                const urlObj = new URL(image);
                image = urlObj.pathname.replace(/^\/+/, "");
            } catch (e) {}
        }

        const imageFileName = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const frontMatter = `---
title: "${title}"
image: "/images/${imageFileName}.webp"
tags: []
---
`;

        let content = `# ${title}\n\nWebsite: [${url}](${url})\n\n`;

        articleContent.find("p:not([class])").each((_, el) => {
            const text = $(el).text().trim();
            if (text) {
                content += `${text}\n\n`;
            }
        });

        const finalDoc = `${frontMatter}\n\n${content}`;

        return NextResponse.json({
            success: true,
            message: "Article parsed successfully",
            markdown: finalDoc,
            title,
            image: `/images/${image}`,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to parse page" },
            { status: 500 },
        );
    }
}
