export * from './all';
export { autoFraction } from './lib/auto-fraction';
export { inlineMathSuffix } from './lib/inline-math';
import type { Context } from './lib/context';

export function math(context: Context) {
    return context.scopes.some(
        scope =>
            !scope.startsWith('comment.line') &&
            scope.startsWith('markup.math'),
    );
}
