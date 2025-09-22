import { configureStore } from "@reduxjs/toolkit";
import articlesReduser from "./articles/articles";
import uiReducer from "./ui/ui";

export const store = configureStore({
    reducer: {
        articles: articlesReduser,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
