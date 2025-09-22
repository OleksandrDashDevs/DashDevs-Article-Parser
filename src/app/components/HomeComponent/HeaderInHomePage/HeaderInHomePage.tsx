"use client";
import { useState } from "react";

import { TextField, Button } from "@mui/material";
import { useParseArticle } from "@/app/hooks/useParseArticle";

import styles from "./HeaderInHomePage.module.css";
import { inputStyles } from "@/app/shared/Spinner/constants/constants";

export const HeaderInHomePage = () => {
    const [articleSrc, setArticleSrc] = useState<string>("");
    const { articleParse } = useParseArticle();
    const { headerWrapper, title } = styles;

    const handleSaveArticleSrc = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setArticleSrc(e.target.value);
    };

    const handleParceArticle = () => {
        articleParse(articleSrc);
    };

    return (
        <header className={headerWrapper}>
            <h1 className={title}>HeaderInHomePage</h1>
            <TextField
                type='text'
                id='outlined-error-helper-text'
                label='Вставте посилання статті'
                variant='outlined'
                sx={{ ...inputStyles.root, width: "800px" }}
                value={articleSrc}
                onChange={e => handleSaveArticleSrc(e)}
            />
            <Button
                variant='outlined'
                disabled={articleSrc.length > 0 ? false : true}
                sx={{
                    height: "56px",
                    borderColor: "#BCC3CD",
                    marginLeft: "20px",
                    color: "#090B0E",
                    borderRadius: "6px",
                }}
                onClick={() => setArticleSrc("")}
            >
                Очистити
            </Button>
            <Button
                variant='outlined'
                disabled={articleSrc.length > 0 ? false : true}
                sx={{
                    height: "56px",
                    borderColor: "#BCC3CD",
                    marginLeft: "20px",
                    color: "#090B0E",
                    borderRadius: "6px",
                }}
                onClick={handleParceArticle}
            >
                Розпарсити статтю
            </Button>
        </header>
    );
};
