/** First letter of a name for the wax seal: skips brackets, emoji and punctuation. */
export const initialOf = (name: string) => name.match(/\p{L}/u)?.[0]?.toUpperCase() ?? "♥";
