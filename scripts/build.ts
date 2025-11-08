import * as fs from 'node:fs';
import * as path from 'node:path';
import { build } from 'rolldown';

main();

async function main() {
    const languages = getLanguages();

    languages.forEach(async language => {
        const output = await buildLanguage(language);
        await fs.promises.writeFile(`dist/${language.name}.hsnips`, output);
    });
}

interface Language {
    name: string;
    snippetPath: string;
    globalPath?: string;
}

async function buildLanguage(language: Language): Promise<string> {
    const [global, snippets] = await Promise.all([
        buildGlobal(language),
        buildSnippets(language),
    ]);
    return global + snippets;
}

async function buildGlobal(language: Language): Promise<string> {
    if (!language.globalPath) return '';

    let code = await bundleGlobal(language);
    code = stripeExport(code);

    return 'global\n' + code.trim() + '\nendglobal\n\n';
}

async function bundleGlobal(language: Language): Promise<string> {
    const output = await build({
        input: language.globalPath,
        output: {
            // minify: true,
        },
        experimental: {
            attachDebugInfo: 'none',
        },
        write: false,
    });

    console.assert(output.output.length === 1);
    const { code } = output.output[0];

    return code;
}

function stripeExport(code: string): string {
    return code.replace(/export\s*\{.*\};?$/, '');
}

async function buildSnippets(language: Language): Promise<string> {
    const snippets = fs.readFileSync(language.snippetPath, 'utf-8');
    return snippets
        .split('\n')
        .map(line => {
            const included = getIncludeTarget(line);
            if (!included) return line;
            return includeSnippets(language.snippetPath, included);
        })
        .join('\n');
}

function getIncludeTarget(line: string): string | null {
    const match = line.match(/^#include "(.*)"\s*$/);
    return match ? match[1] : null;
}

/**
 * @param source Path of the file including the target
 * @param target Path of the file included by the source
 */
function includeSnippets(source: string, target: string) {
    const includedPath = path.join(path.dirname(source), target);
    const includedSnippets = fs.readFileSync(includedPath, 'utf-8');
    return includedSnippets;
}

function getLanguages(): Language[] {
    const snippetsDir = path.join(__dirname, '../src/snippets');
    const globalsDir = path.join(__dirname, '../src/globals');

    const languages = fs
        .readdirSync(snippetsDir)
        .map(filename => {
            const name = filename.match(/(^.*).hsnips$/)?.[1];
            if (!name) return null;

            const snippetPath = path.join(snippetsDir, filename);
            const globalPath = path.join(globalsDir, name + '.ts');

            return {
                name,
                snippetPath,
                ...(fs.existsSync(globalPath) ? { globalPath } : {}),
            };
        })
        .filter(lang => !!lang);
    return languages;
}
