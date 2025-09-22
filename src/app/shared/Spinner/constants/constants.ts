export const inputStyles = {
    root: {
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "#BCC3CD",
            },
            "&.Mui-focused fieldset": {
                border: "2px solid #1367B5",
            },
            "&.Mui-error fieldset": {
                border: "2px solid #ad1313",
            },
            "&:hover fieldset": {
                borderColor: "#BCC3CD",
            },
            "&:hover.Mui-focused fieldset": {
                borderColor: "#1367B5",
            },
            "&:hover.Mui-error fieldset": {
                borderColor: "#ad1313",
                fontFamily: "'Nunito Sans', sans-serif",
            },
            "& input": {
                color: "#090B0E",
            },
        },
        "& .MuiFormLabel-root": {
            color: "#47586E",
            fontFamily: "'Nunito Sans', sans-serif",
            "&.Mui-error": {
                color: "#ad1313",
            },
        },
        "& .MuiInputBase-root": {
            borderRadius: "6px",
        },
        "& .MuiInputBase-input": {
            fontWeight: "400 !important",
            fontSize: "16px !important",
            lineHeight: "24px !important",
            fontFamily: "'Nunito Sans', sans-serif",
            color: "#47586E",
        },
        "& .MuiFormHelperText-root": {
            fontFamily: "'Nunito Sans', sans-serif",
        },
        "& .MuiFormHelperText-root.Mui-error": {
            fontFamily: "'Nunito Sans', sans-serif",
            color: "#ad1313",
        },
    },
};
