export * from './all';
export { autoFraction } from './lib/auto-fraction';
export { inlineMathSuffix } from './lib/inline-math';
import type { Context } from './lib/context';

export function math(context: Context): boolean {
    let hasMarkupMath = false;

    for (const scope of context.scopes) {
        if (scope.startsWith('comment.line')) {
            return false;
        }

        hasMarkupMath ||= scope.startsWith('markup.math');
    }

    return hasMarkupMath;
}
