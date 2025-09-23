"use client";

import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { RootState } from "@/app/store/store";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

import styles from "./MainInHomePage.module.css";

export const MainInHomePage = () => {
    const articleParsedData = useSelector(
        (state: RootState) => state.articles.articleParsedData,
    );
    const articleTitle = useSelector(
        (state: RootState) => state.articles.articleTitle,
    );

    const { wrapper } = styles;

    // const handleCopy = () => {
    //     if (typeof articleParsedData === "string") {
    //         navigator.clipboard.writeText(articleParsedData);
    //         toast.success("Скопійовано в буфер");
    //     }
    // };

    const handleDownload = () => {
        if (
            typeof articleParsedData === "string" &&
            articleParsedData.length > 0
        ) {
            const blob = new Blob([articleParsedData], {
                type: "text/markdown",
            });
            const url = URL.createObjectURL(blob);

            const safeTitle = articleTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            const a = document.createElement("a");
            a.href = url;
            a.download = `${safeTitle}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("Файл збережено");
        }
    };

    return (
        <main className={wrapper}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {articleParsedData?.length > 0 ? articleParsedData : ""}
            </ReactMarkdown>
            <Button
                variant='outlined'
                disabled={articleParsedData?.length > 0 ? false : true}
                sx={{
                    height: "56px",
                    borderColor: "#BCC3CD",
                    marginTop: "20px",
                    color: "#090B0E",
                    borderRadius: "6px",
                }}
                onClick={handleDownload}
            >
                Завантажити файл
            </Button>
        </main>
    );
};
