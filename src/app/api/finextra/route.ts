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
        const $ = cheerio.load(response.data);

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

        const rawDate = $("time.card-timestamp").attr("datetime") || "";
        let date = "";
        if (rawDate) {
            try {
                date = new Date(rawDate).toISOString();
            } catch {}
        }

        let image =
            $('meta[property="og:image"]').attr("content") ||
            articleContent.find("img").first().attr("src") ||
            "";
        if (image.startsWith("http")) {
            try {
                image = new URL(image).pathname.replace(/^\/+/, "");
            } catch {}
        }
        const imageFileName = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const frontMatter = `---
linktitle: "${title}"
image_preview: "/images/${imageFileName}.webp"
date: ${date}
tags: []
seo: []
---
`;

        const contentMarkdown = articleParse($, articleContent);
        const finalDoc = `${frontMatter}# ${title}\n\nWebsite: [${url}](${url})\n\n${contentMarkdown}`;

        return NextResponse.json({
            success: true,
            message: "Парсинг статті пройшов успішно",
            markdown: finalDoc,
            title,
            image: `/images/${imageFileName}.webp`,
        });
    } catch (error: unknown) {
        console.error(error);
        const errorMessage =
            error && typeof error === "object" && "message" in error
                ? (error as { message?: string }).message ||
                  "Помилка під час процесу парсингу"
                : "Помилка під час процесу парсингу";
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 },
        );
    }
}
