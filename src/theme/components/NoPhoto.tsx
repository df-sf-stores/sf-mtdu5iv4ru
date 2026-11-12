import { CategoryIcon, type IconKind } from './CategoryIcon'
import styles from '../styles/media.module.css'

/**
 * What a picture frame shows when the store has no photo for it: a neutral panel that fills the frame, with the
 * category's own icon or a plain picture outline, and a few words when there is room. Every frame that pictures a
 * product or a collection uses it, so a missing photo looks the same everywhere and is never mistaken for one: the
 * store's logo is the brand's mark, not a product's picture. Each frame keeps its size, so nothing moves when a photo
 * is added later.
 */
export const NoPhoto = ({ label, kind }: { label?: string | undefined; kind?: IconKind | undefined }) => (
  <span className={styles.frame}>
    <span className={styles.box}>
      {kind ? (
        <CategoryIcon kind={kind} className={styles.category} />
      ) : (
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="3.5" y="5" width="17" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4" />
        </svg>
      )}
      {label ? <span className={styles.label}>{label}</span> : null}
    </span>
  </span>
)
