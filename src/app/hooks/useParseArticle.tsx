import { useDispatch } from "react-redux";
import { setLoading } from "../store/ui/ui";
import {
    setParsedArticleData,
    setArticleTitle,
} from "../store/articles/articles";
import { toast } from "react-toastify";

export const useParseArticle = () => {
    const dispatch = useDispatch();

    const articleParse = async (url: string) => {
        dispatch(setLoading(true));
        try {
            const res = await fetch("/api/finextra", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const result = await res.json();
            console.log(result);
            toast[result.success ? "success" : "error"](result.message);

            dispatch(setParsedArticleData(result.markdown));
            dispatch(setArticleTitle(result.title));
            return result;
        } catch (error) {
            return {
                success: false,
                message: (error as Error).message,
            };
        } finally {
            dispatch(setLoading(false));
        }
    };

    return { articleParse };
};
