import type { ReactNode } from "react"

import { t } from "@palamedes/core/macro"
import { Marked, type MarkedToken, type Token, type Tokens } from "marked"
import { Fragment } from "react"

import showcases from "~/data/werner.showcases.json"

import { ExperienceHighlight } from "./ExperienceHighlight"
import { getExperience } from "./experienceLogos"
import * as styles from "./wernerProfile.css"

const PROJECT_HEADING_DEPTH = 3
const parser = new Marked()
const BUILTIN_TOKEN_TYPES = new Set([
  "blockquote",
  "br",
  "code",
  "codespan",
  "def",
  "del",
  "em",
  "escape",
  "heading",
  "hr",
  "html",
  "image",
  "link",
  "list",
  "list_item",
  "paragraph",
  "space",
  "strong",
  "table",
  "text",
])

function isBuiltinToken(token: Token): token is MarkedToken {
  return BUILTIN_TOKEN_TYPES.has(token.type)
}

function documentTokens(markdown: string): MarkedToken[] {
  return parser.lexer(markdown).flatMap((token) => {
    if (!isBuiltinToken(token)) throw new Error(`Unsupported profile token: ${token.type}`)
    return token.type === "space" ? [] : [token]
  })
}

const showcaseUrls = new Set(
  showcases.showcases.flatMap((entry) => (entry.url === undefined ? [] : [entry.url]))
)

function renderLink(link: Tokens.Link): ReactNode {
  if (!link.href.startsWith("https://") && !link.href.startsWith("mailto:")) {
    throw new Error("Unsupported profile link protocol.")
  }
  return (
    <a href={link.href}>
      {showcaseUrls.has(link.href) ? (
        <>
          <svg aria-label={t`Showcase`} height="12" role="img" viewBox="0 0 24 24" width="12">
            <path
              d="m12 2 3.1 6.3 7 .9-5 4.9 1.2 6.9-6.3-3.3-6.3 3.3 1.2-6.9-5-4.9 7-.9Z"
              fill="currentColor"
            />
          </svg>{" "}
        </>
      ) : null}
      {inline(link.tokens)}
    </a>
  )
}

function inline(tokens: readonly Token[]): ReactNode {
  const occurrences = new Map<string, number>()
  return tokens.map((token) => {
    if (!isBuiltinToken(token)) throw new Error(`Unsupported profile inline token: ${token.type}`)
    const occurrence = occurrences.get(token.raw) ?? 0
    occurrences.set(token.raw, occurrence + 1)
    const key = `${token.type}:${token.raw}:${occurrence}`
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- unsupported document syntax is rejected by the default branch
    switch (token.type) {
      case "br": {
        return <br key={key} />
      }
      case "codespan":
      case "escape":
      case "text": {
        return <Fragment key={key}>{token.text}</Fragment>
      }
      case "em": {
        return <em key={key}>{inline(token.tokens)}</em>
      }
      case "link": {
        return <Fragment key={key}>{renderLink(token)}</Fragment>
      }
      case "strong": {
        return <strong key={key}>{inline(token.tokens)}</strong>
      }
      default: {
        throw new Error(`Unsupported profile inline token: ${token.type}`)
      }
    }
  })
}

function renderHeading(heading: Tokens.Heading, title?: string): ReactNode {
  const content = inline(heading.tokens)
  if (heading.depth === 1) return title === undefined ? <h1>{content}</h1> : <h2>{title}</h2>
  if (heading.depth === 2) return <h2>{content}</h2>
  return <h3>{content}</h3>
}

function renderList(list: Tokens.List): ReactNode {
  return (
    <ul>
      {list.items.map((item) => (
        <li key={item.raw}>
          {item.tokens
            .filter((part) => part.type !== "space")
            .map((part) => (
              <Fragment key={part.raw}>
                {part.type === "text"
                  ? inline(isBuiltinToken(part) ? (part.tokens ?? []) : [])
                  : block(part)}
              </Fragment>
            ))}
        </li>
      ))}
    </ul>
  )
}

function renderTable(table: Tokens.Table): ReactNode {
  return (
    <div className={styles.tableWrapper}>
      <table>
        <thead>
          <tr>
            {table.header.map((cell) => (
              <th key={cell.text} scope="col">
                {inline(cell.tokens)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.map((cell) => cell.text).join("|")}>
              {row.map((cell) => (
                <td key={cell.text}>{inline(cell.tokens)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderParagraph(paragraph: Tokens.Paragraph): ReactNode {
  const first = paragraph.tokens.at(0)
  if (first !== undefined && isBuiltinToken(first) && first.type === "strong") {
    const experience = getExperience(first.text)
    if (experience !== undefined) {
      const body = paragraph.tokens.slice(paragraph.tokens[1]?.type === "br" ? 2 : 1)
      return (
        <ExperienceHighlight experience={experience} title={inline(first.tokens)}>
          {inline(body)}
        </ExperienceHighlight>
      )
    }
  }
  return <p>{inline(paragraph.tokens)}</p>
}

function block(token: Token, title?: string): ReactNode {
  if (!isBuiltinToken(token)) throw new Error(`Unsupported profile block token: ${token.type}`)
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- unsupported document syntax is rejected by the default branch
  switch (token.type) {
    case "heading": {
      return renderHeading(token, title)
    }
    case "list": {
      return renderList(token)
    }
    case "paragraph": {
      return renderParagraph(token)
    }
    case "table": {
      return renderTable(token)
    }
    default: {
      throw new Error(`Unsupported profile block token: ${token.type}`)
    }
  }
}

function projectBlock(
  tokens: readonly MarkedToken[],
  start: number
): { next: number; node: ReactNode } {
  const parts: ReactNode[] = []
  let index = start
  do {
    parts.push(<Fragment key={tokens[index].raw}>{block(tokens[index])}</Fragment>)
    index += 1
  } while (index < tokens.length && tokens[index].type !== "heading")
  return {
    next: index,
    node: (
      <section className={styles.project} data-profile-project="" key={tokens[start].raw}>
        {parts}
      </section>
    ),
  }
}

export function MarkdownContent({
  markdown,
  title,
}: {
  markdown: string
  title?: string
}): ReactNode {
  const tokens = documentTokens(markdown)
  const content: ReactNode[] = []
  let index = 0
  while (index < tokens.length) {
    const token = tokens[index]
    if (token.type === "heading" && token.depth === PROJECT_HEADING_DEPTH) {
      const project = projectBlock(tokens, index)
      content.push(project.node)
      index = project.next
    } else {
      content.push(<Fragment key={token.raw}>{block(token, title)}</Fragment>)
      index += 1
    }
  }
  return <div className={styles.prose}>{content}</div>
}
