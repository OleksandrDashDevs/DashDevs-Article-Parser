import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./store/StoreProvider";

const interSans = Inter({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const interMono = Inter({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "DashDevs parsing app",
    description: "DashDevs Parser Application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${interSans.variable} ${interMono.variable}`}>
                <StoreProvider>{children}</StoreProvider>
            </body>
        </html>
    );
}
