"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import ReactMarkdown from "react-markdown";

import markDownStyles from "./MarkDownResult.module.css";
import styles from "../MainInHomePage/MainInHomePage.module.css";

export const MarkDownResult = () => {
    const articleParsedData = useSelector(
        (state: RootState) => state.articles.articleParsedData,
    );

    const cleanContent = (data: string) => {
        if (!data) return "";

        // 1. Прибираємо front matter
        const first = data.indexOf("---");
        const second = data.indexOf("---", first + 3);
        if (first === 0 && second !== -1) {
            data = data.slice(second + 3).trim();
        }

        // 2. Перетворюємо Website -> Source з доменом
        data = data.replace(
            /Website:\s*\[(https?:\/\/[^\]]+)\]\([^)]+\)/,
            (match, url) => {
                try {
                    const { hostname } = new URL(url);
                    return `Source: [${hostname}](${url})`;
                } catch {
                    return "";
                }
            },
        );

        return data;
    };

    const contentToPreview = cleanContent(articleParsedData);

    return (
        <div className={styles.parsedArticleTextArea}>
            <div className={markDownStyles.markdown}>
                <ReactMarkdown>
                    {contentToPreview || "Nothing to preview"}
                </ReactMarkdown>
            </div>
        </div>
    );
};
