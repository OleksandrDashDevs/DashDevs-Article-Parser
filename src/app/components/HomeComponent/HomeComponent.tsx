import { HeaderInHomePage } from "./HeaderInHomePage/HeaderInHomePage";
import { MainInHomePage } from "./MainInHomePage/MainInHomePage";
import { Footer } from "../Footer/Footer";

import styles from "./HomeComponent.module.css";

export const HomeComponent = () => {
    const { wrapper } = styles;
    return (
        <div className={wrapper}>
            <HeaderInHomePage />
            <MainInHomePage />
            <Footer />
        </div>
    );
};
