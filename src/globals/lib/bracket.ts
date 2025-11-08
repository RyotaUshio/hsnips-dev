export interface FindMatchingBracketParams {
    text: string;
    brackets: [string, string];
    /** Inclusive */
    start?: number;
    /** Inclusive */
    end?: number;
    backward?: boolean;
}

export function findMatchingBracket(params: FindMatchingBracketParams): number {
    return params.backward
        ? findMatchingBracketBackward(params)
        : findMatchingBracketForward(params);
}

function findMatchingBracketForward(params: FindMatchingBracketParams): number {
    const {
        text,
        brackets: [open, close],
    } = params;
    let { start, end } = { start: 0, end: text.length - 1, ...params };
    if (start < 0) start += text.length;
    if (end < 0) end += text.length;

    let i = start;
    let count = 0;
    while (i + open.length - 1 <= end && i + close.length - 1 <= end) {
        const maybeOpen = text.slice(i, i + open.length);
        if (maybeOpen === open) {
            count++;
            i += open.length;
            continue;
        }

        const maybeClose =
            open.length === close.length
                ? maybeOpen
                : text.slice(i, i + close.length);
        if (maybeClose === close) {
            count--;
            if (count === 0) {
                return i;
            }

            i += close.length;
            continue;
        }

        i++;
    }

    return -1;
}

function findMatchingBracketBackward(
    params: FindMatchingBracketParams,
): number {
    const {
        text,
        brackets: [open, close],
    } = params;
    let { start, end } = { start: text.length - 1, end: 0, ...params };
    if (start < 0) start += text.length;
    if (end < 0) end += text.length;

    // +1 as start is inclusive
    let i = start + 1;
    let count = 0;
    while (i - open.length >= end && i - close.length >= end) {
        const maybeClose = text.slice(i - close.length, i);
        if (maybeClose === close) {
            count++;
            i -= close.length;
            continue;
        }

        const maybeOpen =
            open.length === close.length
                ? maybeClose
                : text.slice(i - open.length, i);
        if (maybeOpen === open) {
            count--;
            i -= open.length;

            if (count === 0) {
                return i;
            }

            continue;
        }

        i--;
    }

    return -1;
}

export const brackets = [
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
];

export const openBracketToPair = new Map<string, [string, string]>(
    brackets.map(([open, close]) => [open, [open, close]]),
);

export const closeBracketToPair = new Map<string, [string, string]>(
    brackets.map(([open, close]) => [close, [open, close]]),
);
