import styles from "./Footer.module.css";
const { footer } = styles;

export const Footer = () => {
    return (
        <footer className={footer}>
            <div>
                <p>
                    © 2011-{new Date().getFullYear()} Dashdevs Software
                    Development Company. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
