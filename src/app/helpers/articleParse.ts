import * as cheerio from "cheerio";
import type { Cheerio as CheerioType } from "cheerio";
import type { AnyNode } from "domhandler";

export function articleParse($: cheerio.CheerioAPI, articleContent: unknown) {
    let content = "";
    const skipClasses = [
        "card-baseline",
        "button",
        "content-box",
        "article-authorDetails",
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processElement = (el: any) => {
        const $el = $(el);

        const classes = ($el.attr("class") || "").split(/\s+/);
        if (classes.some(c => skipClasses.includes(c))) return;

        const tag = el.tagName?.toLowerCase();

        if (tag === "p") {
            let html = $el.html() || "";
            html = html.replace(
                /<strong>(.*?)<\/strong>/gi,
                (_, inner) => `**${inner.trim()}**`,
            );
            const text = html.replace(/<[^>]+>/g, "").trim();

            if (text) {
                const sentences = text.split(/(?<=[.?!])\s+(?=[A-ZА-Я])/);
                sentences.forEach(sentence => {
                    const clean = sentence.trim();
                    if (clean) content += `${clean}\n\n`;
                });
            }
        } else if (tag === "h2" || tag === "h3" || tag === "h4") {
            const text = $el.text().trim();
            if (text) {
                const hashes =
                    tag === "h2" ? "##" : tag === "h3" ? "###" : "####";
                content += `${hashes} ${text}\n\n`;
            }
        } else if (tag === "ul") {
            $el.find("li").each((_, li) => {
                const liText = $(li).text().trim();
                const strongInside = $(li).find("strong").first().text().trim();
                if (strongInside) {
                    content += `* **${strongInside}**${liText
                        .replace(strongInside, "")
                        .trim()}\n`;
                } else if (liText) {
                    content += `* ${liText}\n`;
                }
            });
            content += "\n";
        } else if (tag === "ol") {
            $el.find("li").each((i, li) => {
                const liText = $(li).text().trim();
                const strongInside = $(li).find("strong").first().text().trim();
                if (strongInside) {
                    content += `${i + 1}. **${strongInside}**${liText
                        .replace(strongInside, "")
                        .trim()}\n`;
                } else if (liText) {
                    content += `${i + 1}. ${liText}\n`;
                }
            });
            content += "\n";
        } else {
            $el.children().each((_, child) => processElement(child));
        }
    };
    ($articleContent =>
        $articleContent
            .children()
            .each((_: unknown, el: unknown) => processElement(el)))(
        articleContent as CheerioType<AnyNode>,
    );

    return content.trimEnd() + "\n";
}
