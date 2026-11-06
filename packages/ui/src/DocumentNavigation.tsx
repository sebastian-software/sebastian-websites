import { createContext, type ReactNode, use } from "react"

const DocumentNavigationContext = createContext(false)

/**
 * Select native links for statically rendered sites; router sites keep their defaults.
 * @param props - The navigation scope.
 * @param props.children - The site rendered with native links.
 * @returns The scoped site tree.
 */
export function DocumentNavigation({ children }: { readonly children: ReactNode }): ReactNode {
  return <DocumentNavigationContext value>{children}</DocumentNavigationContext>
}

/**
 * Whether this tree uses full document navigation.
 * @returns True when links should load a new document.
 */
export function useDocumentNavigation(): boolean {
  return use(DocumentNavigationContext)
}
