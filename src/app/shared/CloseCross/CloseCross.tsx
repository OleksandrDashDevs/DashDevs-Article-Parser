"use client";

import { ICloseCross } from "@/app/interfaces/articles";

import styles from "./CloseCross.module.css";

export const CloseCross = ({ onClick }: ICloseCross) => {
    const { drawerCrossLogo } = styles;
    return <button className={drawerCrossLogo} onClick={onClick} />;
};
