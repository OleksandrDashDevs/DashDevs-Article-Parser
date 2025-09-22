import { createSlice } from "@reduxjs/toolkit";
import { IUiInitialState } from "@/app/interfaces/ui";

const initialState: IUiInitialState = {
    isLoading: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setLoading } = uiSlice.actions;
export default uiSlice.reducer;
