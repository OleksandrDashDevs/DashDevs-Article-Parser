"use client";

import { useSelector, useDispatch } from "react-redux";
import { TextField, Button } from "@mui/material";
import { MarkDownResult } from "../MarkDownResult/MarkDownResult";

import {
    setParsedArticleData,
    setFileName,
} from "@/app/store/articles/articles";
import { RootState } from "@/app/store/store";
import { toast } from "react-toastify";

import styles from "./MainInHomePage.module.css";

import { inputStyles } from "@/app/shared/constants/constants";
const { wrapper, parsedArticleTextArea, inputContainer } = styles;

export const MainInHomePage = () => {
    const dispatch = useDispatch();
    const articleParsedData = useSelector(
        (state: RootState) => state.articles.articleParsedData,
    );
    const fileName = useSelector((state: RootState) => state.articles.fileName);

    const handleDownload = () => {
        if (
            typeof articleParsedData === "string" &&
            articleParsedData.length > 0
        ) {
            const blob = new Blob([articleParsedData], {
                type: "text/markdown",
            });
            const url = URL.createObjectURL(blob);

            const safeTitle = fileName;

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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setParsedArticleData(e.target.value));
    };
    const handleChangeArticleTitle = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        dispatch(setFileName(e.target.value));
    };

    return (
        <main className={wrapper}>
            <textarea
                value={articleParsedData}
                onChange={handleChange}
                className={parsedArticleTextArea}
            />
            <MarkDownResult />
            <div className={inputContainer}>
                <TextField
                    type='text'
                    id='outlined-error-helper-text'
                    label='File name'
                    variant='outlined'
                    sx={{ ...inputStyles.root, width: "800px" }}
                    value={fileName}
                    onChange={handleChangeArticleTitle}
                />
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
                    Download file
                </Button>
            </div>
        </main>
    );
};
