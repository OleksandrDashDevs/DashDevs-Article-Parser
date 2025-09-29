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

        const first = data.indexOf("---");
        const second = data.indexOf("---", first + 3);
        if (first === 0 && second !== -1) {
            data = data.slice(second + 3).trim();
        }

        // data = data.replace(/\[(https?:\/\/[^\]]+)\]\(\1\)/g, (_match, url) => {
        //     try {
        //         let { hostname } = new URL(url);
        //         hostname = hostname.replace(/^www\./, "");
        //         return `[${hostname}](${url})`;
        //     } catch {
        //         return _match;
        //     }
        // });

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
