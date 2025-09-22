"use client";

import Backdrop from "@mui/material/Backdrop";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { RootState } from "../../store/store";

export const Spinner = () => {
    const isLoading = useSelector((state: RootState) => state.ui.isLoading);

    return (
        <div>
            <Backdrop
                sx={theme => ({
                    color: "#fff",
                    zIndex: theme.zIndex.drawer + 1,
                })}
                open={isLoading}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        </div>
    );
};
