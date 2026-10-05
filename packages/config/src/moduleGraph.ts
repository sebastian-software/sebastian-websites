import path from "node:path"
import ts from "typescript"

function scriptKind(file: string): ts.ScriptKind {
  switch (path.extname(file)) {
    case ".cjs": {
      return ts.ScriptKind.JS
    }
    case ".js": {
      return ts.ScriptKind.JS
    }
    case ".jsx": {
      return ts.ScriptKind.JSX
    }
    case ".mjs": {
      return ts.ScriptKind.JS
    }
    case ".tsx": {
      return ts.ScriptKind.TSX
    }
    default: {
      return ts.ScriptKind.TS
    }
  }
}

export function extractModuleSpecifiers(source: string, file = "source.ts"): string[] {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(file)
  )
  const specifiers: string[] = []

  function addSpecifier(node: ts.Expression | undefined): void {
    if (node && ts.isStringLiteralLike(node)) {
      specifiers.push(node.text)
    }
  }

  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      addSpecifier(node.moduleSpecifier)
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      addSpecifier(node.moduleReference.expression)
    } else if (
      ts.isCallExpression(node) &&
      node.arguments.length > 0 &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require"))
    ) {
      addSpecifier(node.arguments[0])
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return specifiers
}

export function findDependencyCycles(
  graph: ReadonlyMap<string, readonly string[]>
): readonly string[][] {
  const cycles: string[][] = []
  const visited = new Set<string>()
  const active = new Set<string>()
  const stack: string[] = []

  function visit(name: string): void {
    if (active.has(name)) {
      const cycleStart = stack.indexOf(name)
      cycles.push([...stack.slice(cycleStart), name])
      return
    }
    if (visited.has(name)) {
      return
    }

    active.add(name)
    stack.push(name)
    for (const dependency of graph.get(name) ?? []) {
      visit(dependency)
    }
    stack.pop()
    active.delete(name)
    visited.add(name)
  }

  for (const name of graph.keys()) {
    visit(name)
  }

  return cycles
}
