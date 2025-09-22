import { createSlice } from "@reduxjs/toolkit";
import { IArticlesInitialState } from "@/app/interfaces/articles";

const initialState: IArticlesInitialState = {
    articleParsedData: [],
};

const articlesSlice = createSlice({
    name: "articles",
    initialState,
    reducers: {
        setParsedArticleData: (state, action) => {
            state.articleParsedData = action.payload;
        },
    },
});

export const { setParsedArticleData } = articlesSlice.actions;
export default articlesSlice.reducer;
