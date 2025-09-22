"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@mui/material";

export const MainInHomePage = () => {
    const articleParsedData = useSelector(
        (state: RootState) => state.articles.articleParsedData,
    );
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (typeof articleParsedData === "string") {
            navigator.clipboard.writeText(articleParsedData).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                console.log(copied);
            });
        }
    };
    return (
        <main>
            {" "}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {typeof articleParsedData === "string" ? articleParsedData : ""}
            </ReactMarkdown>
            <Button
                variant='outlined'
                // disabled={articleParsedData.length > 0 ? false : true}
                sx={{
                    height: "56px",
                    borderColor: "#BCC3CD",
                    marginLeft: "20px",
                    color: "#090B0E",
                    borderRadius: "6px",
                }}
                onClick={handleCopy}
            >
                Скопіювати результат
            </Button>
        </main>
    );
};
