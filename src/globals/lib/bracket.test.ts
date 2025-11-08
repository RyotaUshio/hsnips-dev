import { findMatchingBracket, type FindMatchingBracketParams } from './bracket';

describe('findMatchingBracket', () => {
    it('works for a single pair of parentheses', () => {
        expect(
            findMatchingBracket({
                text: 'hello (world)!',
                brackets: ['(', ')'],
            }),
        ).toBe(12);
    });

    it('works for nested parentheses', () => {
        expect(
            findMatchingBracket({
                text: 'he(llo (wor)ld))!',
                brackets: ['(', ')'],
            }),
        ).toBe(14);
    });

    it('works for unmatching nested parentheses', () => {
        expect(
            findMatchingBracket({
                text: 'he(llo (wor)ld))!',
                brackets: ['(', ')'],
                start: 2,
            }),
        ).toBe(14);
    });

    it('can start searching from a given index (inclusive)', () => {
        const text = 'he(llo (wor)ld))!';

        expect(
            findMatchingBracket({
                text,
                brackets: ['(', ')'],
                start: 2,
            }),
        ).toBe(14);

        expect(
            findMatchingBracket({
                text,
                brackets: ['(', ')'],
                start: 3,
            }),
        ).toBe(11);
    });

    it('can end searching at a given index (inclusive)', () => {
        const text = '01(345(789)bc))f';
        expect(
            findMatchingBracket({
                text,
                brackets: ['(', ')'],
                start: 2,
                end: 12,
            }),
        ).toBe(-1);

        expect(
            findMatchingBracket({
                text,
                brackets: ['(', ')'],
                start: 2,
                end: 13,
            }),
        ).toBe(13);
    });

    it('end (and start) can be negative', () => {
        const text = '01(345(789)bc))f';
        expect(
            findMatchingBracket({
                text,
                brackets: ['(', ')'],
                start: 2,
                end: -4,
            }),
        ).toBe(-1);

        expect(
            findMatchingBracket({
                text,
                brackets: ['(', ')'],
                start: 2,
                end: -3,
            }),
        ).toBe(13);
    });

    it('accepts multi-char brackets', () => {
        const params: FindMatchingBracketParams = {
            text: 'Let $\\Delta := \\lVert x - a \\rVert$.',
            brackets: ['\\lVert', '\\rVert'],
            start: 5,
            end: 33,
        };
        expect(findMatchingBracket(params)).toBe(
            params.text.indexOf(params.brackets[1], params.start),
        );
    });

    describe('backward search', () => {
        const text = '\\frac{\\sum_{i=1}^{n} a_{n}}{2}';
        const params: FindMatchingBracketParams = {
            text,
            brackets: ['{', '}'],
            backward: true,
        };

        it('can search backwards', () => {
            expect(findMatchingBracket(params)).toBe(text.length - 3);
        });

        it('can search backward from a given index (inclusive)', () => {
            expect(
                findMatchingBracket({ ...params, start: text.length - 4 }),
            ).toBe(5);

            expect(
                findMatchingBracket({ ...params, start: text.length - 5 }),
            ).toBe(text.length - 7);
        });

        it('start (and end) can be negative', () => {
            expect(findMatchingBracket({ ...params, start: -4 })).toBe(5);

            expect(findMatchingBracket({ ...params, start: -5 })).toBe(
                text.length - 7,
            );
        });

        it('can search backward until a give index (inclusive)', () => {
            expect(findMatchingBracket({ ...params, start: -4, end: 6 })).toBe(
                -1,
            );

            expect(findMatchingBracket({ ...params, start: -4, end: 5 })).toBe(
                5,
            );
        });

        it('can handle opening and closing brackets with different length', () => {
            const text = 'f(x) = \\exp \\left( -2nt^{2} \\right)';
            expect(
                findMatchingBracket({
                    text,
                    brackets: ['\\left(', '\\right)'],
                    backward: true,
                }),
            ).toBe(12);
        });
    });

    test('some more examples', () => {
        expect(
            findMatchingBracket({
                text: '(abc)',
                brackets: ['(', ')'],
            }),
        ).toBe(4);

        expect(
            findMatchingBracket({
                text: '(abc)',
                brackets: ['(', ')'],
                backward: true,
                start: 4,
            }),
        ).toBe(0);
    });
});
