import { t } from "@palamedes/core/macro"

export const SERVICE_IDS = ["architecture", "internationalization", "modernization"] as const

export const SERVICE_PATHS = {
  architecture: "/services/architecture-review",
  internationalization: "/services/internationalization",
  modernization: "/services/react-typescript-modernization",
} as const

export type ServiceId = keyof typeof SERVICE_PATHS

type ParagraphSection = {
  readonly paragraphs: readonly string[]
  readonly title: string
}

export type ServicePage = {
  readonly approach: readonly ParagraphSection[]
  readonly deliverables: readonly string[]
  readonly description: string
  readonly evidence: ReadonlyArray<{
    readonly href: string
    readonly label: string
    readonly text: string
  }>
  readonly fit: readonly string[]
  readonly id: ServiceId
  readonly lead: string
  readonly questions: readonly ParagraphSection[]
  readonly situations: readonly string[]
  readonly title: string
}

function architectureService(): ServicePage {
  return {
    approach: [
      {
        paragraphs: [
          t`We clarify what the review needs to settle, who maintains the application, and which product constraints matter. Together we choose representative code and workflows rather than inspecting every file without a question.`,
        ],
        title: t`Start with the decision`,
      },
      {
        paragraphs: [
          t`We examine interfaces, dependencies, component boundaries, rendering, and the build or delivery workflow where they affect that decision. Conversations with the team connect the code to the reasons it took its current shape.`,
        ],
        title: t`Trace the architecture in practice`,
      },
      {
        paragraphs: [
          t`We discuss the findings, compare realistic options, and document their tradeoffs. The result is a prioritized recommendation and a concrete next step, with assumptions and open questions visible to the people implementing it.`,
        ],
        title: t`Agree the next useful step`,
      },
    ],
    deliverables: [
      t`An explanation of the relevant architecture and the sources of coupling or uncertainty.`,
      t`Options with their tradeoffs and a reasoned recommendation.`,
      t`Prioritized next steps that account for ongoing product work and team ownership.`,
    ],
    description: t`Review your web application's architecture with experienced consultants. Understand the tradeoffs, agree priorities, and choose a practical next step with your team.`,
    evidence: [
      {
        href: "/werner",
        label: t`Read Werner's architecture experience`,
        text: t`At EnBW, Werner worked on white-label customer portals, reusable components, and frontend architecture. His published project history explains the scope; the references include perspectives from colleagues on that work.`,
      },
      {
        href: "/fastner/project-profile",
        label: t`Read Fastner's project experience`,
        text: t`Fastner's project profile covers frontend architecture and implementation in investment platforms and multi-brand commerce. It shows how architecture decisions connect to work in established teams.`,
      },
    ],
    fit: [
      t`A review is useful when your team needs a better-grounded decision. You work directly with the consultants who examine the code and explain the recommendation.`,
      t`It is not a security certification, a compliance assessment, or a guarantee that the architecture will never need to change. If implementation is already the main task, our modernization work may be a better starting point.`,
    ],
    id: "architecture",
    lead: t`Before committing to a rewrite or another layer of tooling, understand what is making your application difficult to change. We review the architecture with your team and turn the findings into decisions you can act on.`,
    questions: [
      {
        paragraphs: [
          t`Access to the relevant code and documentation, an explanation of the product constraints, and time with the people who maintain the system. We agree the scope and access arrangements before the work begins.`,
        ],
        title: t`What do we need from your team?`,
      },
      {
        paragraphs: [
          t`The review supports a decision. We can also work alongside your team to implement the next step, but agree that work separately so the review does not silently become an open-ended rewrite.`,
        ],
        title: t`Is implementation part of the review?`,
      },
      {
        paragraphs: [
          t`That depends on the question and the part of the application involved. In the introductory conversation, we establish the situation and what a useful review would need to cover before discussing effort.`,
        ],
        title: t`How long does a review take?`,
      },
    ],
    situations: [
      t`A change crosses too many modules, and nobody can explain the boundaries with confidence.`,
      t`Several teams or products need shared foundations, but it is unclear what should be shared.`,
      t`You need to decide between improving the existing system and replacing part of it.`,
    ],
    title: t`Software architecture reviews`,
  }
}

function modernizationService(): ServicePage {
  return {
    approach: [
      {
        paragraphs: [
          t`We review a representative change path with your team: the code it touches, the dependencies it relies on, and the checks that make a release credible. Product constraints determine where modernization should begin.`,
        ],
        title: t`Find a manageable starting point`,
      },
      {
        paragraphs: [
          t`Together we decide which boundaries, components, or dependencies need to change first. We plan how existing and new code can coexist, which behavior must remain stable, and how the team will verify each step.`,
        ],
        title: t`Sequence the migration`,
      },
      {
        paragraphs: [
          t`We work in the code alongside your team through implementation, reviews, and pairing. We connect changes to testing and delivery, and leave the reasoning where the next maintainer can find it.`,
        ],
        title: t`Implement with the maintainers`,
      },
    ],
    deliverables: [
      t`A prioritized modernization path with explicit dependencies and scope.`,
      t`Implemented changes to the agreed application or frontend foundations.`,
      t`Verification and working knowledge that the maintaining team can continue using.`,
    ],
    description: t`Modernize an existing React and TypeScript application alongside your team: review the foundations, sequence the migration, and implement changes while product work continues.`,
    evidence: [
      {
        href: "/fastner/project-profile",
        label: t`Explore the commerce project experience`,
        text: t`The published Witt project experience describes work on the foundations of multi-brand online shops. Fastner's compact profile explains his role, technologies, and contributions in that context.`,
      },
      {
        href: "/werner/projects",
        label: t`Explore Werner's project history`,
        text: t`Werner's project history includes evolving investment platforms and shared frontend foundations. The individual project accounts distinguish his contribution from the wider team's delivery.`,
      },
    ],
    fit: [
      t`This work fits teams that maintain an existing React or TypeScript product and want practical help implementing change. We work with the people responsible for the next release.`,
      t`A rewrite is not the default deliverable. If the main uncertainty is which direction to take, start with an architecture review; if the decision is already clear, we can discuss a focused implementation scope.`,
    ],
    id: "modernization",
    lead: t`An established application still has to ship while its foundations change. We help your team improve React and TypeScript code, dependencies, and delivery in steps that fit the product you are maintaining.`,
    questions: [
      {
        paragraphs: [
          t`We plan around ongoing delivery rather than assuming it can stop. The migration path needs explicit compatibility boundaries and release checks; which changes can safely run in parallel depends on the application.`,
        ],
        title: t`Can product development continue?`,
      },
      {
        paragraphs: [
          t`We also implement. Architecture decisions, hands-on development, pairing, and code reviews can form one engagement, with a scope that makes responsibility clear.`,
        ],
        title: t`Do you only provide recommendations?`,
      },
      {
        paragraphs: [
          t`Bring an example of a change that has become difficult, the technologies involved, and the constraints on your next releases. We use that situation to discuss whether a review or direct implementation is the useful starting point.`,
        ],
        title: t`What do we discuss first?`,
      },
    ],
    situations: [
      t`Upgrades keep being postponed because their effects are hard to predict.`,
      t`Shared components, application boundaries, or build tools have become obstacles to everyday changes.`,
      t`Your team needs hands-on support to move from an architectural recommendation to working code.`,
    ],
    title: t`React and TypeScript modernization`,
  }
}

function internationalizationService(): ServicePage {
  return {
    approach: [
      {
        paragraphs: [
          t`We inventory interface text and user-generated content as different concerns. With your team, we clarify languages, context, terminology, review responsibilities, and the systems that already hold or translate the content.`,
        ],
        title: t`Separate the language problems`,
      },
      {
        paragraphs: [
          t`For the interface, we connect extraction, catalogs, review, and build or release integration. For user content, we examine the translation pipeline, processing, quality evaluation, and operational needs separately.`,
        ],
        title: t`Build the workflow into the product`,
      },
      {
        paragraphs: [
          t`We work in the existing application and its delivery process. Pairing, code reviews, and documentation help the team understand the conventions and maintain language support after the initial work.`,
        ],
        title: t`Introduce the changes incrementally`,
      },
    ],
    deliverables: [
      t`An internationalization approach that distinguishes interface text from user content.`,
      t`Agreed extraction, catalog, terminology, and review workflows connected to development.`,
      t`Implementation and operational guidance for the language capabilities in scope.`,
    ],
    description: t`Bring language support into an established SaaS product: interface localization, catalogs and terminology, release workflows, and translation of user-generated content.`,
    evidence: [
      {
        href: "/references#recommendation-chris-lewis",
        label: t`Read the Regrello recommendation`,
        text: t`At Regrello, Werner and Fastner worked on interface internationalization and translation of user-generated content. Their profiles explain their respective work; Chris Lewis's recommendation also describes the shared contribution.`,
      },
      {
        href: "/team",
        label: t`Meet the consultants and their experience`,
        text: t`Our open-source work on Palamedes grows from practical internationalization experience. It is relevant tooling experience, not a requirement that your team adopt Palamedes or buy a managed product.`,
      },
    ],
    fit: [
      t`This work fits an established product whose team needs language support to become a maintainable capability. We work with the application's current architecture and the people responsible for its content and releases.`,
      t`We do not promise perfect automated translations or a guaranteed market outcome. Quality criteria, human review, and the handling of sensitive content need to match the product and the material being translated.`,
    ],
    id: "internationalization",
    lead: t`Adding another language affects more than the interface strings. We help product teams make internationalization part of their code, translation workflow, and delivery, including the content their users create.`,
    questions: [
      {
        paragraphs: [
          t`Not by default. We first examine the workflow and constraints. Keeping existing tools, improving their integration, or changing part of the setup are options to assess with your team.`,
        ],
        title: t`Do we need to change translation tools?`,
      },
      {
        paragraphs: [
          t`No. Interface text usually follows the development and release workflow. User content needs its own processing, evaluation, and operational decisions. We agree which problem the engagement needs to address.`,
        ],
        title: t`Is translating user content the same as localizing the interface?`,
      },
      {
        paragraphs: [
          t`Tell us which application and languages are involved, where the current process breaks down, and who develops, translates, and reviews the content. We can then discuss a useful first scope.`,
        ],
        title: t`How do we start?`,
      },
    ],
    situations: [
      t`Text is spread through an established codebase and language support is difficult to introduce safely.`,
      t`Catalogs, terminology, reviews, and releases are disconnected from the team's development workflow.`,
      t`Users need to work across languages with content they create themselves, not just translated interface labels.`,
    ],
    title: t`Internationalization for existing SaaS products`,
  }
}

/**
 * Localized offer grounded in the services and project histories already published.
 * @param id - The service whose brief is rendered.
 * @returns The service copy in the active language.
 */
export function getServicePage(id: ServiceId): ServicePage {
  const factories = {
    architecture: architectureService,
    internationalization: internationalizationService,
    modernization: modernizationService,
  }
  return factories[id]()
}
