import Babel from '@babel/core';
import path from 'path';
import fs from 'fs';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const ignoreFlag = '@nohoc';

export default function (babel: typeof Babel): Babel.PluginObj {
  const { types: t } = babel;
  const appConfigPath = path.join(process.cwd(), './src/app.config.ts');
  let pages: string[] = [];

  if (fs.existsSync(appConfigPath)) {
    const code = fs.readFileSync(appConfigPath).toString();
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript'],
    });
    traverse(ast, {
      ArrayExpression(path) {
        if (
          t.isObjectProperty(path.parent) &&
          t.isIdentifier(path.parent.key) &&
          path.parent.key.name === 'pages'
        ) {
          pages = pages.concat(path.node.elements.map((m: any) => m.value));
        }
      },
    });
  }

  return {
    name: 'babel-plugin-taro-page-hoc',
    visitor: {
      ExportDefaultDeclaration(path, state) {
        const { hocSource, hocName = '__hoc__' } = state.opts as any;
        const ignore = path.node.leadingComments?.some((m) => m.value.trim() === ignoreFlag);
        const filename = state.filename;
        const isPage = filename.includes('.config.')
          ? false
          : pages.some((m) => state.filename.includes(m));

        if (!t.isClassDeclaration(path.node.declaration) && hocSource && isPage && !ignore) {
          path.insertBefore(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(hocName))],
              t.stringLiteral(hocSource),
            ),
          );
          path.node.declaration = t.callExpression(t.identifier(hocName), [
            path.node.declaration as any,
          ]);
        }
      },
    },
  };
}
