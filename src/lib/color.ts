export function withAlpha(hexColor: string, alpha: string): string {
  if (!hexColor.startsWith("#")) {
    return hexColor;
  }
  return `${hexColor}${alpha}`;
}
