import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "../store/ui/ui";
import { toast } from "react-toastify";

export const useUploadFile = () => {
    const dispatch = useDispatch();
    const uploadFile = async ({
        fileName,
        content,
        commitMessage,
    }: {
        fileName: string;
        content: string;
        commitMessage: string;
    }) => {
        dispatch(setLoading(true));
        try {
            const res = await axios.post("/api/uploadfile", {
                fileName,
                content,
                commitMessage,
            });
            const data = res.data;

            if (res.data.fileExists) {
                toast.error(`${data.message}`);
            }
            toast[data.success ? "success" : "error"](`${data.message}`);
            return res.data;
        } catch (error) {
            return {
                success: false,
                message: (error as Error).message,
            };
        } finally {
            dispatch(setLoading(false));
        }
    };

    return { uploadFile };
};
