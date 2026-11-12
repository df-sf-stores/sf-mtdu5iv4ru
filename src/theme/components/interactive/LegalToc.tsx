'use client'

import { createContext, use, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useInView } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/policy.module.css'

type Entry = { id: string; title: string }

type Spy = {
  seen: ReadonlySet<string>
  report: (id: string, inView: boolean) => void
}

const SpyContext = createContext<Spy>({
  seen: new Set(),
  report: () => undefined,
})

/** Holds which legal sections are on screen, so the contents can mark the one being read. */
export const LegalSpy = ({ children }: { children: ReactNode }) => {
  const [seen, setSeen] = useState<ReadonlySet<string>>(new Set())
  const report = (id: string, inView: boolean) =>
    setSeen((before) => {
      if (before.has(id) === inView) return before
      const next = new Set(before)
      if (inView) next.add(id)
      else next.delete(id)
      return next
    })
  return <SpyContext value={{ seen, report }}>{children}</SpyContext>
}

/**
 * One numbered section of the text. It watches a marker set a header's height above its heading (.legalMarker), so
 * the section counts as on screen only once its heading is clear of the sticky header.
 */
export const LegalSection = ({ id, className, children }: { id: string; className: string | undefined; children: ReactNode }) => {
  const marker = useRef<HTMLSpanElement>(null)
  const inView = useInView(marker)
  const { report } = use(SpyContext)
  useEffect(() => report(id, inView), [id, inView])
  return (
    <section id={id} className={className}>
      <span ref={marker} className={styles.legalMarker} aria-hidden="true" />
      {children}
    </section>
  )
}

/**
 * The legal page's contents: a sticky list beside the text on wide screens, a list that opens above it on small
 * ones. Each link jumps to its section (theme rules leave the page's own scrolling to the browser). The section whose
 * heading is highest on screen is marked, or the one just picked while its heading shows: the last sections can't
 * reach the top of the window.
 */
export const LegalToc = ({ label, sections }: { label: string; sections: Entry[] }) => {
  const { seen } = use(SpyContext)
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState('')
  const [last, setLast] = useState(sections[0]?.id ?? '')
  const current = seen.has(picked) ? picked : sections.find((s) => seen.has(s.id))?.id
  useEffect(() => {
    if (current) setLast(current)
  }, [current])
  const active = current ?? last

  const list = (className: string | undefined) => (
    <ol className={className} onClick={() => setOpen(false)}>
      {sections.map(({ id, title }) => (
        <li key={id} className={id === active ? styles.legalNavItemActive : styles.legalNavItem} onClick={() => setPicked(id)}>
          <Link href={`#${id}`} className={styles.legalNavLink}>
            {title}
          </Link>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <nav className={styles.legalNav} aria-label={label}>
        <div className={styles.legalNavSticky}>
          <p className={styles.legalNavLabel}>{label}</p>
          {list(styles.legalNavList)}
        </div>
      </nav>
      <nav className={styles.legalMobileNav} aria-label={label}>
        <button type="button" className={styles.legalMobileToggle} aria-expanded={open} aria-controls="legal-contents" onClick={() => setOpen(!open)}>
          {label}
          <svg className={open ? styles.legalChevronOpen : styles.legalChevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <div id="legal-contents" hidden={!open}>
          {list(styles.legalMobileList)}
        </div>
      </nav>
    </>
  )
}
