import { closeBracketToPair, findMatchingBracket } from './bracket';

/**
 * @param text Preceding text
 */
export function autoFraction(text: string) {
    let i = text.length - 1;

    for (; i >= 0; i--) {
        const char = text[i];

        if ([')', ']', '}'].includes(char)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const brackets = closeBracketToPair.get(char)!;
            const openPos = findMatchingBracket({
                text,
                brackets,
                backward: true,
                start: i,
            });

            if (openPos !== -1) {
                // jump to the opening bracket
                i = openPos;
                continue;
            }
        }

        if (['(', '[', '{'].includes(char)) {
            // this opening bracket does not have a matching closing bracket,
            // so don't include it in \frac
            break;
        }
    }

    const from = i + 1;
    return text.slice(0, from) + '\\frac{' + text.slice(from) + '}';
}
