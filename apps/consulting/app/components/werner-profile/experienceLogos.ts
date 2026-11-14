import threeDegrees from "~/assets/company/3degrees-wordmark.svg"
import deutscheBank from "~/assets/company/deutschebank.svg"
import telekom from "~/assets/company/deutschetelekom.svg"
import dws from "~/assets/company/dws.svg"
import empiriecom from "~/assets/company/empiriecom-black.svg"
import enbw from "~/assets/company/enbw.svg"
import regrello from "~/assets/company/regrello.svg"
import witt from "~/assets/company/witt-weiden.svg"
import zynga from "~/assets/company/zynga.svg"

type ExperienceLogo = { height: number; name: string; source: string; width: number }
export type Experience = { id: string; logos: ExperienceLogo[] }

const experiences: Experience[] = [
  {
    id: "regrello",
    logos: [{ height: 22, name: "Regrello", source: regrello, width: 88 }],
  },
  {
    id: "3degrees",
    logos: [{ height: 25, name: "3Degrees", source: threeDegrees, width: 96 }],
  },
  {
    id: "otto-group",
    logos: [
      { height: 36, name: "Witt", source: witt, width: 72 },
      { height: 19, name: "empiriecom", source: empiriecom, width: 88 },
    ],
  },
  {
    id: "deutsche-bank-dws",
    logos: [
      { height: 18, name: "Deutsche Bank", source: deutscheBank, width: 96 },
      { height: 26, name: "DWS", source: dws, width: 72 },
    ],
  },
  {
    id: "telekom-zynga",
    logos: [
      { height: 34, name: "Deutsche Telekom", source: telekom, width: 28 },
      { height: 34, name: "Zynga", source: zynga, width: 37 },
    ],
  },
  {
    id: "enbw",
    logos: [{ height: 17, name: "EnBW", source: enbw, width: 96 }],
  },
]

export function getExperience(id: string): Experience {
  const experience = experiences.find((entry) => entry.id === id)
  if (experience === undefined) throw new Error(`Unknown profile experience: ${id}`)
  return experience
}
