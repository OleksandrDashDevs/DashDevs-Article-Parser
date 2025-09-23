import { createSlice } from "@reduxjs/toolkit";
import { IArticlesInitialState } from "@/app/interfaces/articles";

const initialState: IArticlesInitialState = {
    articleParsedData: "",
    articleTitle: "",
    selectedTags: [],
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
        setSelectedTags: (state, action) => {
            state.selectedTags = [...action.payload];
        },
        clearAllFields: state => {
            state.articleParsedData = "";
            state.articleTitle = "";
            state.selectedTags = [];
        },
    },
});

export const {
    setParsedArticleData,
    setArticleTitle,
    setSelectedTags,
    clearAllFields,
} = articlesSlice.actions;
export default articlesSlice.reducer;
