"use client";

import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
    setParsedArticleData,
    setSelectedTags,
} from "@/app/store/articles/articles";
import { Drawer } from "@mui/material";
import { RootState } from "@/app/store/store";

import { CloseCross } from "@/app/shared/CloseCross/CloseCross";
import { tags } from "@/app/shared/constants/constants";

import { ITagDrawer } from "@/app/interfaces/articles";
import styles from "./TagsDrawer.module.css";
const {
    drawerContainer,
    titleContainer,
    drawerListingList,
    drawerServiceItem,
    customCheckboxContainer,
    customCheckbox,
    customCheckboxLabel,
    drawerServicesTitleContainer,
} = styles;

export const TagDrawer = ({ openDrawer, toggleDrawer }: ITagDrawer) => {
    const dispatch = useDispatch();
    const articleParsedData = useSelector(
        (state: RootState) => state.articles.articleParsedData,
    );
    const selectedTags = useSelector(
        (state: RootState) => state.articles.selectedTags,
    );

    const handleCheckboxChange = (tag: string, checked: boolean) => {
        const newSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter(t => t !== tag);

        dispatch(setSelectedTags(newSelectedTags));

        if (typeof articleParsedData === "string") {
            const lines = articleParsedData
                .split(/\r?\n/)
                .map(line => line.trim());
            const frontMatterStart = lines.indexOf("---");
            const frontMatterEnd = lines.indexOf("---", frontMatterStart + 1);

            console.log("Front Matter Start:", frontMatterStart);
            console.log("Front Matter End:", frontMatterEnd);

            if (frontMatterStart !== -1 && frontMatterEnd !== -1) {
                const frontMatterLines = lines.slice(
                    frontMatterStart + 1,
                    frontMatterEnd,
                );
                const contentLines = lines.slice(frontMatterEnd + 1);

                const updatedFrontMatter = frontMatterLines.map(line => {
                    if (line.startsWith("tags:")) {
                        return `tags: [${newSelectedTags
                            .map(t => `"${t}"`)
                            .join(", ")}]`;
                    }
                    return line;
                });

                const updatedArticle = [
                    "---",
                    ...updatedFrontMatter,
                    "---",
                    ...contentLines,
                ].join("\n");

                console.log(updatedArticle);
                dispatch(setParsedArticleData(updatedArticle));
            }
        } else {
            console.log("articleParsedData не є рядком");
        }
    };

    return (
        <Drawer
            open={openDrawer}
            onClose={() => toggleDrawer(false)}
            anchor='right'
        >
            <div className={drawerContainer}>
                <div className={titleContainer}>
                    <h2>Список доступних тегів</h2>
                    <CloseCross onClick={() => toggleDrawer(false)} />
                </div>
                <ul className={drawerListingList}>
                    {tags.map(tag => (
                        <li className={drawerServiceItem} key={tag}>
                            <div className={customCheckboxContainer}>
                                <input
                                    type='checkbox'
                                    id={`checkbox-${tag}`}
                                    className={customCheckbox}
                                    checked={selectedTags.includes(tag)}
                                    onChange={e =>
                                        handleCheckboxChange(
                                            tag,
                                            e.target.checked,
                                        )
                                    }
                                />
                                <label
                                    htmlFor={`checkbox-${tag}`}
                                    className={customCheckboxLabel}
                                >
                                    <Image
                                        width={16}
                                        height={16}
                                        src='/icons/check.svg'
                                        alt='checkbox icon'
                                    />
                                </label>
                            </div>
                            <div className={drawerServicesTitleContainer}>
                                <p>{tag}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Drawer>
    );
};
