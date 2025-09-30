import { useDispatch } from "react-redux";
import axios from "axios";
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
            } else if (url.includes("pymnts")) {
                route = "/api/pymnts";
            } else if (url.includes("yahoo")) {
                route = "/api/yahoo";
            }

            if (!route) {
                toast.error("Unsupported website.");
                return {
                    success: false,
                    message: "Unsupported website",
                };
            }

            const res = await axios.post(
                route,
                { url },
                {
                    headers: { "Content-Type": "application/json" },
                },
            );

            const data = res.data;
            toast[data.success ? "success" : "error"](`${data.message}`);

            dispatch(setParsedArticleData(data.markdown));
            dispatch(setArticleTitle(data.title));
            dispatch(setFileName(`${data.date.slice(0, 10)} ${data.title}`));
            return data;
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
