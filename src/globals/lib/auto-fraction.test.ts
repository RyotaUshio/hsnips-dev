import { autoFraction } from './auto-fraction';

describe('autoFraction', () => {
    it('works', () => {
        expect(autoFraction('abc')).toBe('\\frac{abc}');
        expect(autoFraction('(abc')).toBe('(\\frac{abc}');
        expect(autoFraction('(abc)')).toBe('\\frac{(abc)}');
        expect(autoFraction('(abc){def')).toBe('(abc){\\frac{def}');
        expect(autoFraction('(abc){def}')).toBe('\\frac{(abc){def}}');
    });

    it('might be better to do nothing (like Latex Suite)...', () => {
        expect(autoFraction('abc)')).toBe('\\frac{abc)}');
        expect(autoFraction('(abc)def}')).toBe('\\frac{(abc)def}}');
    });
});
