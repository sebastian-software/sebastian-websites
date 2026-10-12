import { t } from "@palamedes/core/macro"

export type Recommendation = {
  readonly author: string
  readonly authorHref?: string
  readonly date: string
  readonly excerpt?: string
  readonly group: "collaboration" | "practice" | "product"
  readonly id: string
  readonly quote: string
  readonly topic: string
}

/**
 * Complete English originals from VISIBLE received recommendations in the
 * October 6, 2026 LinkedIn export. All were received by Werner; Lewis also
 * explicitly describes the joint project. Keep the original names and dates.
 * Omit exported employers and titles, whose historical accuracy is uncertain.
 * Existing author links were verified on LinkedIn on October 12, 2026.
 * The homepage alone uses a labeled, localized excerpt from the full original.
 *
 * @returns The complete recommendation about the joint Regrello project.
 */
export function getFeaturedRecommendation(): Recommendation {
  return {
    author: "Chris Lewis",
    authorHref: "https://www.linkedin.com/in/cmslewis/",
    date: "2025-08-22",
    excerpt: t`For the past several months, they've been working on the behemoth Milestone 2: translating user-inputted data in such a way that users from different locales can collaborate on millions of user-created entities in our platform in whatever language they each individually prefer. The Sebastians have been instrumental in this effort as well.`,
    group: "product",
    id: "chris-lewis",
    quote:
      "Sebastian is a breath of fresh air: he's a true Principal-level frontend engineer, if the tech industry would acknowledge such a thing. My endorsement will focus on two dimensions: Sebastian as a consultant and Sebastian as a Frontend & UX thought leader.  1. Sebastian as a consultant: At Regrello, we brought in Sebastian and his compatriot \"the other Sebastian\" (a.k.a. \"the more backend-y Sebastian\") to internationalize our web application, including both static UI strings and user-inputted data. The research process they and our in-house project lead followed for the first milestone of the project (translating static UI strings) was remarkably thorough, and their solution was unbelievably elegant: it would leverage robust open-source technologies and work beautifully, and its DevX was unmatched, able to update translations and even add new translations in seconds with the aid of an LLM translation service they devised themselves.  For the past several months, they've been working on the behemoth Milestone 2: translating user-inputted data in such a way that users from different locales can collaborate on millions of user-created entities in our platform in whatever language they each individually prefer. The Sebastians have been instrumental in this effort as well.  2. Sebastian as a Frontend & UX thought leader: The fun surprise for me was that Sebastian is deeply, deeply knowledgeable and passionate about both frontend engineering best practices and user experience (UX). Given latitude to offer insight on these topics, his expertise shines: he will consider the unique story of how your codebase and product came to be and then offer as much feedback or as many ideas as you wish about what you can do to improve your UX posture. He will write thoughtful RFCs and muse with you about everything from component factoring to enterprise UX patterns to a11y to surface-level details, and he has the decades of technical chops to implement or guide the implementation of everything he proposes. We have implemented or are currently implementing several of his recommendations and overall feel that in the ~1 year he's been with us, he has had an outsized impact on how we think about UX and frontend engineering at a fundamental level. I'd recommend him to anyone hungry for this expertise at their company.",
    topic: t`Internationalization at Regrello`,
  }
}

/**
 * Complete accounts spanning product work, collaboration, and engineering.
 *
 * @returns Fifteen recommendations with their original wording and dates.
 */
// eslint-disable-next-line max-lines-per-function -- curated original recommendation data
export function getRecommendations(): readonly Recommendation[] {
  return [
    getFeaturedRecommendation(),
    {
      author: "Travis Glover",
      authorHref: "https://www.linkedin.com/in/travis-n-glover-0tng0/",
      date: "2026-07-30",
      group: "product",
      id: "travis-glover",
      quote:
        "I have the pleasure of working alongside Sebastian Werner, and I can confidently say he's one of the most forward-thinking engineers I've worked with.  Sebastian's expertise in app text translation and localization is truly unparalleled. He helped us establish a scalable localization architecture across several applications and significantly improved the developer workflow around translations. His work consistently ensured that our localization efforts were accurate, maintainable, and provided an excellent experience for users across different languages and regions.  What sets Sebastian apart even further is his commitment to staying at the forefront of software engineering. He's always exploring and applying the latest AI-powered tools and cutting-edge engineering techniques to improve productivity, code quality, and development workflows. His curiosity and willingness to embrace new technology make him an invaluable teammate and someone I regularly learn from.  Beyond his technical abilities, Sebastian is a thoughtful collaborator and an absolute pleasure to work with. He brings a positive attitude, shares his knowledge freely, and consistently raises the bar for those around him. Any team would be fortunate to have Sebastian, and I highly recommend him.",
      topic: t`Localization and developer experience`,
    },
    {
      author: "Mike Cozart",
      authorHref: "https://www.linkedin.com/in/mikecozart/",
      date: "2026-07-09",
      group: "product",
      id: "mike-cozart",
      quote:
        "Sebastian is a joy to work with, and I recommend him without reservation. He's the rare engineer who thinks strategically and executes flawlessly. A front-end expert, he consistently balances user experience, product strategy, and business goals to ship work of exceptional quality. Beyond his technical skill, he elevates everyone around him—thoughtful, collaborative, and genuinely a pleasure to have on a team. Any organization would be lucky to have him.",
      topic: t`Product judgment and frontend engineering`,
    },
    {
      author: "Damian Osipiuk",
      authorHref: "https://www.linkedin.com/in/damian-osipiuk/",
      date: "2025-08-22",
      group: "collaboration",
      id: "damian-osipiuk",
      quote:
        "I had the pleasure of working with Sebastian for about a year, during which he consistently demonstrated dedication, thoughtfulness, and strong technical expertise. His depth of knowledge, kept continuously up to date, made him a valuable contributor to our team.  Sebastian excels at identifying opportunities for improvement while remaining pragmatic and collaborative, ensuring that progress is made without unnecessary friction. I was particularly impressed by his user-centric mindset. He is deeply committed to enhancing user experience and continuously strives to make the applications he works on more effective and impactful.  I would highly recommend Sebastian for any project focused on Frontend development and User Experience.",
      topic: t`Pragmatic engineering and user experience`,
    },
    {
      author: "Artur König",
      date: "2024-04-22",
      group: "collaboration",
      id: "artur-konig",
      quote:
        "I highly recommend Sebastian as a Lead Frontend Developer and software architect. In our 1,5 years working together, he consistently showcases up-to-date technical skills, meticulous attention to detail, customer-centric focus, an open-minded approach and particularly important, his sense of humor that enriches our team collaboration. Sebastian is a valuable asset for any project or team.",
      topic: t`Technical depth and team spirit`,
    },
    {
      author: "Rouven Haban",
      date: "2024-01-31",
      group: "collaboration",
      id: "rouven-haban",
      quote:
        "I had the pleasure of working with Sebastian as his Scrum Master for more then a year. Sebastian is an exceptional lead developer whose deep technical expertise and innovative mindset consistently drive our team toward success. His ability to translate complex concepts into clear, actionable solutions has been invaluable in our agile environment. Sebastian mentors with ease and inspires our team to reach new heights. Under his guidance, we've seen significant improvements in efficiency and product quality. I wholeheartedly recommend Sebastian for any advanced development role. He is not just a highly skilled developer but also a true team player who brings immense value to every project he is part of.",
      topic: t`Technical leadership and mentoring`,
    },
    {
      author: "Tobias Arweiler",
      authorHref: "https://www.linkedin.com/in/tobias-arweiler/",
      date: "2024-01-30",
      group: "collaboration",
      id: "tobias-arweiler",
      quote:
        "Sebastian is a very professional, very experienced software architect who knows what he's talking about. In our shared project at EnBW he was an important voice for a sane and technologically sound software architecture, as well as a great sparring partner with any technological question or idea you'd come up with. Any project team would be happy to have him as a team member, as he can support with technical implementation as well as complex architectural discussion. I wish him all the best.",
      topic: t`Architecture at EnBW`,
    },
    {
      author: "Emanuele De Monte",
      date: "2023-11-28",
      group: "collaboration",
      id: "emanuele-de-monte",
      quote:
        "During our time together at EnBW, I have come to know him as a contractor and saw him as an exceptionally competent and dedicated Lead Front End Developer.  Sebastian possesses an extensive knowledge of the latest frontend technologies and demonstrates a remarkable ability to creatively and efficiently solve complex problems. He has played a key role in driving the Project toward the development of innovative and user-friendly web applications.  I want to thank you for the time together and look forward to the completion of the Project.",
      topic: t`Frontend engineering at EnBW`,
    },
    {
      author: "Kai S",
      authorHref: "https://www.linkedin.com/in/kai-s-b5a78618a/",
      date: "2023-11-14",
      group: "collaboration",
      id: "kai-s",
      quote:
        "Sebastian is a remarkable mentor and coworker. His depth of knowledge and eagerness to share his expertise has been a huge advantage to our entire team and I wouldn‘t want to miss him.  One of Sebastian’s most admirable qualities is his willingness to listen and offer guidance. Whenever I encountered a challenge, Sebastian was there with a patient ear and practical solutions. His advice and insights have been invaluable to me, both professionally and personally.  I confidently recommend Sebastian as a dedicated and knowledgeable professional and an all-around great person to work with. He will be a beneficial addition to any organization.",
      topic: t`Mentoring and knowledge sharing`,
    },
    {
      author: "Cesare Cesari",
      date: "2020-09-08",
      group: "collaboration",
      id: "cesare-cesari",
      quote:
        "As a UX Designer, it is great to work with Sebastian. His user-centered mindset supported and challenged the team and me. He is curious and never afraid of leaving the comfort zone when that means aiming for quality. For sure a value for any company he collaborates with.",
      topic: t`A shared focus on users`,
    },
    {
      author: "Igor Ilić",
      date: "2020-08-31",
      group: "collaboration",
      id: "igor-ilic",
      quote:
        "My team and I witnessed during our collaboration with Mr. Werner how can one knowledgable and experienced person provoke the minds of the entire team. It forces us to learn more and to learn in the right direction, so then we could find solutions on our own. Giving the team working solutions is valuable, but teach them how to think and solve the problem is more beneficial.  Other than that, I enjoyed the company of Sebastian and the number of times I have a benefit to provide working solutions for the complex problems with his help.",
      topic: t`Helping teams find their own solutions`,
    },
    {
      author: "Alex Fechner",
      date: "2019-02-05",
      group: "practice",
      id: "alex-fechner",
      quote:
        "I had the pleasure of being mentored by Sebastian during a coaching for the setup of an React based enterprise application in the healthcare sector. He is a passionate software developer, clear in his communication and a productive partner to exchange thoughts. He has my highest recommendation.",
      topic: t`Practical coaching in healthcare`,
    },
    {
      author: "Florian Eibeck",
      date: "2017-10-26",
      group: "practice",
      id: "florian-eibeck",
      quote:
        "Sebastian did a great job as a Frontend Engineer and Architect in our team. He happily shared his knowledge and teached us how to write state-of-the-art React applications.   Thanks for the good collaboration, it was a pleasure working together!",
      topic: t`React architecture and knowledge transfer`,
    },
    {
      author: "Patric Schouler",
      date: "2015-04-28",
      group: "practice",
      id: "patric-schouler",
      quote:
        "I enjoyed the time to work together with Sebastian in a challenging project at Deutsche Telekom for our TV Delivery Devision. Sebastian has worked for us in a international team as UI Architect and JavaScript/HTML consultant. In our subproject we are focussing to build the new UI for the product Entertain TV. His very high skills in Web Development was very helpful and Sebastian did a professional job. Especially his work on some reusable UI components was very impressive and helps our project and other teams at DT a lot. Thank you for your work, I would like to work with you every time again.",
      topic: t`Reusable interfaces at Deutsche Telekom`,
    },
    {
      author: "Paul Bakaus",
      date: "2012-09-20",
      group: "practice",
      id: "paul-bakaus",
      quote:
        "Sebastian is a rare talent, and having him become part of our team has payed off in more than just one way. He has a unique talent to discover how a feature ideally *should* work, instead of implementing what others have told him, and thus improves the whole feature. He also often serves a voice of reason within heated developer arguments and understands the whole picture of an architecture.    One of the things I and Sebastian have in common that is rare to find in developers is the eye for visual finish and user experience. It is very rare to find a senior JavaScript developer who can do large-scale architectural work, but also have enough artistic sense to rate the UX of an application. He appreciates the little details that PMs often don't see, but consumers definitely will.",
      topic: t`Architecture with an eye for the details`,
    },
  ]
}
