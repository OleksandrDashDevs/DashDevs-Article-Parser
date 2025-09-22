import { useDispatch } from "react-redux";
import { setLoading } from "../store/ui/ui";
import { setParsedArticleData } from "../store/articles/articles";

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
            console.log(result.markdown);
            dispatch(setParsedArticleData(result.markdown));
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
