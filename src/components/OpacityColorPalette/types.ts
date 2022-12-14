export interface IOpacityColorPalette {
    hue: number;
    saturation: number;
    lightness: number;
    onClick: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>, color: string) => void;
}
