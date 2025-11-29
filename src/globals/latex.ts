export * from './all';
export { autoFraction } from './lib/auto-fraction';
export { inlineMathSuffix } from './lib/inline-math';
import type { Context } from './lib/context';

export function math(context: Context): boolean {
    let hasMetaMath = false;

    for (const scope of context.scopes) {
        if (
            scope.startsWith('comment.line') ||
            scope === 'punctuation.definition.string.begin.tex'
        ) {
            return false;
        }

        hasMetaMath ||= scope.startsWith('meta.math');
    }

    return hasMetaMath;
}
