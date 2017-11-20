export interface EditorPane {
    name: string;

    template: string;

    iconName: string;
    iconColor: string;

    getDisplayName(): string;
}