"use client";

import { useSelector, useDispatch } from "react-redux";
import { useUploadFile } from "@/app/hooks/useUploadFileToGit";
import { TextField, Button } from "@mui/material";
import { MarkDownResult } from "../MarkDownResult/MarkDownResult";

import {
    setParsedArticleData,
    setFileName,
} from "@/app/store/articles/articles";
import { RootState } from "@/app/store/store";
// import { toast } from "react-toastify";

import styles from "./MainInHomePage.module.css";

import { inputStyles } from "@/app/shared/constants/constants";
const { wrapper, parsedArticleTextArea, inputContainer, spanElement } = styles;

export const MainInHomePage = () => {
    const dispatch = useDispatch();
    const { uploadFile } = useUploadFile();
    const articleParsedData = useSelector(
        (state: RootState) => state.articles.articleParsedData,
    );
    const fileName = useSelector((state: RootState) => state.articles.fileName);

    const handleUpload = async () => {
        if (
            typeof articleParsedData === "string" &&
            articleParsedData.length > 0
        ) {
            const commitMessage = `Download file ${fileName}.md`;

            await uploadFile({
                fileName: `${fileName}.md`,
                content: articleParsedData,
                commitMessage,
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setParsedArticleData(e.target.value));
    };
    const handleChangeArticleTitle = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const value = e.target.value;
        const sanitizedValue = value.replace(/[^a-zA-Zа-яА-Я0-9 -]/g, "");
        dispatch(setFileName(sanitizedValue));
    };

    return (
        <main className={wrapper}>
            <textarea
                value={articleParsedData}
                onChange={handleChange}
                className={parsedArticleTextArea}
                id='parsed-article'
                name='parsed-article'
            />
            {articleParsedData?.length > 0 ? <MarkDownResult /> : null}

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
                <TextField
                    type='text'
                    id='outlined-error-helper-text'
                    label='URL name'
                    variant='outlined'
                    sx={{ ...inputStyles.root, width: "800px" }}
                    value={fileName.toLowerCase().replace(/\s+/g, "-")}
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
                    onClick={handleUpload}
                >
                    Upload file to github
                </Button>
            </div>
            <div>
                <p>Supported sites</p>
                <ul>
                    <li>https://www.finextra.com/</li>
                    <li>https://www.pymnts.com/</li>
                    <li>https://uk.finance.yahoo.com/</li>
                    <li>https://ffnews.com/</li>
                    <li>
                        https://www.fintechfutures.com/{" "}
                        <span className={spanElement}>
                            for developers only (local use)
                        </span>
                    </li>
                </ul>
            </div>
        </main>
    );
};
