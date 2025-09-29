"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { TextField, Button } from "@mui/material";
import { useParseArticle } from "@/app/hooks/useParseArticle";
import { clearAllFields, setSelectedTags } from "@/app/store/articles/articles";
import { TagDrawer } from "./TagsDrawer/TagsDrawer";

import styles from "./HeaderInHomePage.module.css";
import { inputStyles, buttonStyles } from "@/app/shared/constants/constants";

export const HeaderInHomePage = () => {
    const dispatch = useDispatch();
    const [articleSrc, setArticleSrc] = useState<string>("");
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    const { articleParse } = useParseArticle();

    const { headerWrapper, title } = styles;

    const handleSaveArticleSrc = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setArticleSrc(e.target.value);
    };

    const handleParceArticle = () => {
        dispatch(setSelectedTags([]));
        articleParse(articleSrc);
    };

    const toggleDrawer = (isOpenDrawer: boolean) => {
        setOpenDrawer(isOpenDrawer);
    };

    return (
        <header className={headerWrapper}>
            <h1 className={title}>DashDevs Article Parser</h1>
            <TextField
                type='text'
                id='outlined-error-helper-text'
                label='Insert the article link'
                variant='outlined'
                sx={{ ...inputStyles.root, width: "800px" }}
                value={articleSrc}
                onChange={e => handleSaveArticleSrc(e)}
            />
            <Button
                variant='outlined'
                disabled={articleSrc.length > 0 ? false : true}
                sx={buttonStyles}
                onClick={() => {
                    setArticleSrc("");
                    dispatch(clearAllFields());
                }}
            >
                Clear all fields
            </Button>
            <Button
                variant='outlined'
                disabled={articleSrc.length > 0 ? false : true}
                sx={buttonStyles}
                onClick={handleParceArticle}
            >
                Parse the article
            </Button>
            <Button
                variant='outlined'
                disabled={articleSrc.length > 0 ? false : true}
                sx={buttonStyles}
                onClick={() => toggleDrawer(true)}
            >
                Tags
            </Button>
            <TagDrawer openDrawer={openDrawer} toggleDrawer={toggleDrawer} />
        </header>
    );
};
