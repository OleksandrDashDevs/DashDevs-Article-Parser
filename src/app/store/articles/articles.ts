import { createSlice } from "@reduxjs/toolkit";
import { IArticlesInitialState } from "@/app/interfaces/articles";

const initialState: IArticlesInitialState = {
    articleParsedData: "",
    articleTitle: "",
};

const articlesSlice = createSlice({
    name: "articles",
    initialState,
    reducers: {
        setParsedArticleData: (state, action) => {
            state.articleParsedData = action.payload;
        },
        setArticleTitle: (state, action) => {
            state.articleTitle = action.payload;
        },
    },
});

export const { setParsedArticleData, setArticleTitle } = articlesSlice.actions;
export default articlesSlice.reducer;
