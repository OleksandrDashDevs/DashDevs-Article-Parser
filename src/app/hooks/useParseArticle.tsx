import { useDispatch } from "react-redux";
import { setLoading } from "../store/ui/ui";
import {
    setParsedArticleData,
    setArticleTitle,
    setFileName,
} from "../store/articles/articles";
import { toast } from "react-toastify";

export const useParseArticle = () => {
    const dispatch = useDispatch();

    const articleParse = async (url: string) => {
        dispatch(setLoading(true));
        try {
            let route: string | null = null;

            if (url.includes("ffnews")) {
                route = "/api/ffnews";
            } else if (url.includes("finextra")) {
                route = "/api/finextra";
            } else if (url.includes("fintechfutures")) {
                route = "/api/fintechfutures";
            }

            if (!route) {
                toast.error("Unsupported website.");
                return {
                    success: false,
                    message: "Unsupported website",
                };
            }

            const res = await fetch(route, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const result = await res.json();
            toast[result.success ? "success" : "error"](result.message);

            dispatch(setParsedArticleData(result.markdown));
            dispatch(setArticleTitle(result.title));
            dispatch(
                setFileName(
                    result.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, ""),
                ),
            );
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
