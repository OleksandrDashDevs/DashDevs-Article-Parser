export interface IArticlesInitialState {
    articleParsedData: string;
    articleTitle: string;
    selectedTags: string[];
}

export interface ITagDrawer {
    openDrawer: boolean;
    toggleDrawer: (open: boolean) => void;
}

export interface ICloseCross {
    onClick: () => void;
}
