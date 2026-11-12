import type { ReactElement } from 'react'
import styles from '../styles/caticons.module.css'

/** Which drawing a collection gets, read from words in its name; a name with none of them gets the spice bowl. */
export type IconKind = 'all' | 'ground' | 'blend' | 'whole' | 'dryFruit' | 'oil' | 'pulse' | 'everyday' | 'chilli' | 'masala' | 'salt' | 'honey' | 'special'

const kinds: [IconKind, RegExp][] = [
  ['ground', /ground|powder/],
  ['blend', /blend/],
  ['whole', /whole|anise|clove/],
  ['dryFruit', /dry ?fruit|nut|almond|cashew/],
  ['oil', /oil|ghee/],
  ['pulse', /pulse|dal|lentil|bean/],
  ['chilli', /chil|pepper/],
  ['masala', /masala/],
  ['salt', /salt|hing|asafoetida/],
  ['honey', /honey|sweet/],
  ['special', /special|saffron|premium/],
  ['everyday', /everyday|daily|spice/],
]

export const iconFor = (name: string): IconKind => kinds.find(([, words]) => words.test(name.toLowerCase()))?.[0] ?? 'blend'

const drawings: Record<IconKind, () => ReactElement> = {
  all: () => (
    <>
      <g className={styles.lift}>
        <path d="M20 28C20 15 44 15 44 28" />
        <circle className={styles.wine} cx="26" cy="25" r="5" />
        <path className={styles.leaf} d="M35 27C34 20 38 16 44 16C44 22 41 26 35 27Z" />
        <path className={styles.paper} d="M10 28H54L49 52Q48.5 55 45.5 55H18.5Q15.5 55 15 52Z" />
        <path className={styles.goldLine} d="M16 37H48M18 46H46M26 30V53M38 30V53" />
      </g>
      <path className={styles.spark} d="M53 6Q53 11 58 11Q53 11 53 16Q53 11 48 11Q53 11 53 6Z" />
      <path className={styles.sparkLate} d="M9 12Q9 16 13 16Q9 16 9 20Q9 16 5 16Q9 16 9 12Z" />
      <path className={styles.sparkLater} d="M58 23Q58 26 61 26Q58 26 58 29Q58 26 55 26Q58 26 58 23Z" />
    </>
  ),
  ground: () => (
    <>
      <path className={styles.mound} d="M16 54Q32 34 48 54Z" />
      <path d="M8 54Q32 61 56 54" />
      <g className={styles.fall}>
        <circle className={styles.grain} cx="27" cy="31" r="1.6" />
        <circle className={styles.grain} cx="31" cy="31" r="1.3" />
        <circle className={styles.grain} cx="29" cy="31" r="1.1" />
      </g>
      <g className={styles.lift}>
        <path d="M38 21L56 12" />
        <ellipse className={styles.paper} cx="29" cy="23" rx="9.5" ry="5.5" />
        <path className={styles.goldThick} d="M21 22Q29 17 37 22" />
      </g>
      <circle className={styles.spark} cx="22" cy="44" r="1.2" />
      <circle className={styles.sparkLate} cx="42" cy="44" r="1.2" />
    </>
  ),
  blend: () => (
    <>
      <path className={styles.steam} d="M18 26q-3-4 0-8t0-8" />
      <path className={styles.steamLate} d="M46 26q-3-4 0-8t0-8" />
      <g className={styles.lift}>
        <path d="M31 36L42 9" />
        <ellipse className={styles.gold} cx="43" cy="7" rx="2.6" ry="2" />
      </g>
      <path className={styles.paper} d="M8 32H56Q54 52 32 54Q10 52 8 32Z" />
      <path className={styles.goldWash} d="M11 37H53Q50 51 32 52Q14 51 11 37Z" />
      <path className={styles.wineLine} d="M21 43Q32 36 43 43Q35 49 28 45" />
      <path d="M24 57H40" />
    </>
  ),
  whole: () => (
    <>
      <g className={styles.turn}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse key={angle} className={styles.paper} cx="24" cy="18.5" rx="3.4" ry="7.5" transform={`rotate(${angle} 24 28)`} />
        ))}
        <circle className={styles.gold} cx="24" cy="28" r="3.5" />
      </g>
      <g className={styles.lift}>
        <ellipse className={styles.leafSoft} cx="47" cy="44" rx="5.5" ry="10" transform="rotate(28 47 44)" />
        <path className={styles.greenLine} d="M43 37Q47 44 46 52" />
      </g>
      <circle className={styles.seed} cx="14" cy="52" r="3" />
      <circle className={styles.seed} cx="22" cy="55" r="3" />
      <circle className={styles.seed} cx="31" cy="53" r="2.6" />
    </>
  ),
  dryFruit: () => (
    <>
      <g className={styles.lift}>
        <path className={styles.goldSoft} d="M22 14C32 22 32 44 22 52C12 44 12 22 22 14Z" />
        <path className={styles.goldLine} d="M22 22C25 30 25 40 22 46" />
      </g>
      <g className={styles.liftLate}>
        <path className={styles.paper} d="M40 22C54 20 59 36 51 46C47 51 40 51 40 46C40 42 46 42 47 36C48 30 43 30 40 30C36 30 36 22 40 22Z" />
        <path className={styles.goldLine} d="M44 25C50 26 53 33 51 39" />
      </g>
      <path d="M8 57H56" />
    </>
  ),
  oil: () => (
    <>
      <g className={styles.lift}>
        <rect className={styles.goldHalf} x="21" y="5" width="12" height="6" rx="1.5" />
        <path className={styles.paper} d="M15 28Q15 21 22 18V11H32V18Q39 21 39 28V52Q39 57 34 57H20Q15 57 15 52Z" />
        <path className={styles.goldFill} d="M17 35Q27 31 37 35V52Q37 55 34 55H20Q17 55 17 52Z" />
        <path className={styles.goldLine} d="M17 35Q27 31 37 35" />
      </g>
      <path className={styles.drop} d="M51 20C51 20 46 27 46 30.5A5 5 0 0 0 56 30.5C56 27 51 20 51 20Z" />
      <path d="M43 57Q51 61 59 57" />
    </>
  ),
  pulse: () => (
    <>
      <g className={styles.lift}>
        <path className={styles.mound} d="M12 36Q32 22 52 36Z" />
        {[
          [22, 32],
          [30, 27],
          [38, 29],
          [45, 33],
          [28, 34],
        ].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} className={styles.bean} cx={x} cy={y} rx="2.8" ry="1.9" />
        ))}
      </g>
      <path className={styles.paper} d="M8 36H56Q54 54 32 56Q10 54 8 36Z" />
      <path className={styles.goldLine} d="M14 44H50" />
    </>
  ),
  everyday: () => (
    <>
      <g className={styles.fall}>
        <circle className={styles.wineDot} cx="47" cy="17" r="1.4" />
        <circle className={styles.wineDot} cx="51" cy="20" r="1.2" />
        <circle className={styles.wineDot} cx="49" cy="15" r="1.1" />
      </g>
      <g className={styles.lift}>
        <rect className={styles.paper} x="18" y="24" width="24" height="32" rx="4" />
        <rect className={styles.goldSoftFill} x="18" y="35" width="24" height="11" />
        <path className={styles.leafLine} d="M26 42Q30 35 35 37Q33 43 26 42Z" />
        <rect className={styles.wine} x="16" y="15" width="28" height="9" rx="2" />
        <path className={styles.whiteLine} d="M23 19.5H37" />
      </g>
    </>
  ),
  chilli: () => (
    <>
      <path className={styles.heat} d="M40 22q-3-3 0-6t0-6" />
      <path className={styles.heatLate} d="M48 26q-3-3 0-6t0-6" />
      <path className={styles.heatLater} d="M56 30q-3-3 0-6t0-6" />
      <g className={styles.lift}>
        <path className={styles.chilliBody} d="M20 22C28 20 34 24 38 32C43 42 48 50 56 54C44 56 32 50 26 42C21 35 18 28 20 22Z" />
        <path className={styles.shine} d="M26 29C28 35 31 40 35 44" />
        <path className={styles.stem} d="M15 23Q20 18 26 23" />
        <path className={styles.greenLine} d="M20 21C17 18 16 14 18 10" />
      </g>
    </>
  ),
  masala: () => (
    <>
      <circle className={styles.spark} cx="19" cy="30" r="1.4" />
      <circle className={styles.wineDot} cx="46" cy="29" r="1.2" />
      <circle className={styles.sparkLate} cx="40" cy="27" r="1.1" />
      <g className={styles.lift}>
        <path className={styles.goldMid} d="M27 39Q25 35 29 33L43 9Q46 5 49.5 7.5Q52 10.5 49 13.5L35 39Q32 42 27 39Z" />
      </g>
      <path className={styles.paper} d="M10 34H54Q52 52 32 54Q12 52 10 34Z" />
      <path className={styles.goldLine} d="M14 40H50" />
      <path d="M23 54L21 58H43L41 54" />
    </>
  ),
  salt: () => (
    <>
      <g className={styles.fall}>
        <rect className={styles.paperThin} x="12" y="20" width="2.4" height="2.4" />
        <rect className={styles.paperThin} x="8" y="24" width="2.2" height="2.2" />
        <rect className={styles.paperThin} x="14" y="26" width="2" height="2" />
      </g>
      <g className={styles.lift}>
        <path className={styles.paper} d="M22 28Q22 22 28 22H36Q42 22 42 28V52Q42 56 38 56H26Q22 56 22 52Z" />
        <path className={styles.cream} d="M24 38H40V52Q40 54 38 54H26Q24 54 24 52Z" />
        <path className={styles.goldHalf} d="M24 22V16Q24 10 32 10Q40 10 40 16V22" />
        <circle className={styles.hole} cx="29" cy="15" r="0.9" />
        <circle className={styles.hole} cx="32" cy="13.5" r="0.9" />
        <circle className={styles.hole} cx="35" cy="15" r="0.9" />
      </g>
    </>
  ),
  honey: () => (
    <>
      <path className={styles.drop} d="M33 24C33 24 30 28 30 30A3 3 0 0 0 36 30C36 28 33 24 33 24Z" />
      <g className={styles.lift}>
        <path d="M46 3L37 16" />
        <rect className={styles.gold} x="28" y="13" width="10" height="9" rx="3" transform="rotate(-34 33 17.5)" />
        <path className={styles.thin} d="M31.5 13V22M34.5 13V22" transform="rotate(-34 33 17.5)" />
      </g>
      <path className={styles.paper} d="M18 30H46Q50 30 50 35V51Q50 57 44 57H20Q14 57 14 51V35Q14 30 18 30Z" />
      <path className={styles.goldFill} d="M16 39Q24 35 32 39Q40 43 48 39V51Q48 55 44 55H20Q16 55 16 51Z" />
      <rect className={styles.paper} x="15" y="26" width="34" height="5" rx="2" />
      <path className={styles.thin} d="M32 43L36 45.5V50L32 52.5L28 50V45.5Z" />
    </>
  ),
  special: () => (
    <>
      <path className={styles.greenLine} d="M32 56V36M32 50Q24 47 21 39M32 47Q40 44 43 36" />
      <g className={styles.lift}>
        <path className={styles.petal} d="M32 36C24 34 19 24 23 14C30 18 33 26 32 36Z" />
        <path className={styles.petal} d="M32 36C40 34 45 24 41 14C34 18 31 26 32 36Z" />
        <path className={styles.paper} d="M32 36C28 28 28 18 32 10C36 18 36 28 32 36Z" />
        <path className={styles.wineThin} d="M32 31L28 21M32 31L36 21M32 31V19" />
      </g>
      <path className={styles.spark} d="M51 9.5Q51 14 55.5 14Q51 14 51 18.5Q51 14 46.5 14Q51 14 51 9.5Z" />
      <path className={styles.sparkLate} d="M13 18.5Q13 22 16.5 22Q13 22 13 25.5Q13 22 9.5 22Q13 22 13 18.5Z" />
    </>
  ),
}

/** A small hand-drawn picture for a category: ink lines, white bodies and the store's gold, wine and green. */
export const CategoryIcon = ({ kind, className }: { kind: IconKind; className?: string | undefined }) => {
  const Drawing = drawings[kind]
  return (
    <svg className={className ? `${styles.icon} ${className}` : styles.icon} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <Drawing />
    </svg>
  )
}
