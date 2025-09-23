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
            } catch (e) {
                console.log(e);
            }
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
                const sentences = text.split(/(?<=[.?!])(?=\s+|[A-ZА-ЯЇЄІ])/);

                sentences.forEach(sentence => {
                    const clean = sentence.trim();
                    if (clean) {
                        content += `${clean}\n\n`;
                    }
                });
            }
        });

        let finalDoc = `${frontMatter}${content}`;
        finalDoc = finalDoc.trimEnd() + "\n";

        return NextResponse.json({
            success: true,
            message: "Парсин статті пройвош усіпшно",
            markdown: finalDoc,
            title,
            image: `/images/${image}`,
        });
    } catch (error: unknown) {
        console.error(error);
        let errorMessage = "Помилка під час процесу парсингу";
        if (error && typeof error === "object" && "message" in error) {
            errorMessage =
                (error as { message?: string }).message || errorMessage;
        }
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 },
        );
    }
}
