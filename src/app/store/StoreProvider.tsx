"use client";

import { Provider } from "react-redux";
import { store } from "./store";

import { Spinner } from "../shared/Spinner/Spinner";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <Spinner />
            {children}
        </Provider>
    );
};
