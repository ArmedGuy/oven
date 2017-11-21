export interface EditorPane {
    name: string;

    template: string;

    icon: string;

    getDisplayName(): string;
}