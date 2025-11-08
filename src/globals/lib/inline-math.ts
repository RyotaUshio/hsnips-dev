/**
 * "Smart" inline math. See https://castel.dev/post/lecture-notes-1/#inline-and-display-math
 */
export function inlineMathSuffix(followingText: string | undefined) {
    return followingText &&
        [',', '.', '?', '-', ' '].some(char => followingText.startsWith(char))
        ? ''
        : ' ';
}
