import { useStorefront } from '@dripfunnel/storefront-core/theme'
import { useContact } from './contact'
import { LegalSection, LegalSpy, LegalToc } from './interactive/LegalToc'
import styles from '../styles/policy.module.css'

export type LegalKind = 'privacy' | 'terms'

type Section = { id: string; title: string; blocks: string[] }

/**
 * A legal text from `content/en/policies.json`, split into sections: '## id | Heading' starts one, blank lines
 * separate its blocks, and a block of '- ' lines is a list.
 */
const sectionsOf = (body: string): Section[] =>
  body.split('\n\n').reduce<Section[]>((sections, block) => {
    if (block.startsWith('## ')) {
      const [id = '', title = ''] = block.slice(3).split(' | ')
      return [...sections, { id: id.trim(), title: title.trim(), blocks: [] }]
    }
    sections.at(-1)?.blocks.push(block)
    return sections
  }, [])

/** Text with '[[Label: note]]' shown as a highlighted note still to be confirmed by the store. */
const Inline = ({ text }: { text: string }) => (
  <>
    {text.split(/(\[\[.+?\]\])/).map((part, i) => {
      if (!part.startsWith('[[')) return part
      const inner = part.slice(2, -2)
      const at = inner.indexOf(':')
      return (
        <mark key={i} className={styles.legalMark}>
          <strong className={styles.legalMarkLabel}>{inner.slice(0, at + 1)}</strong>
          {inner.slice(at + 1)}
        </mark>
      )
    })}
  </>
)

const Block = ({ text }: { text: string }) => {
  const lines = text.split('\n')
  if (lines.every((l) => l.startsWith('- ')))
    return (
      <ul className={styles.legalList}>
        {lines.map((l) => (
          <li key={l} className={styles.legalItem}>
            <span className={styles.legalDot} aria-hidden="true" />
            <span>
              <Inline text={l.slice(2)} />
            </span>
          </li>
        ))}
      </ul>
    )
  return (
    <p className={styles.legalParagraph}>
      <Inline text={text} />
    </p>
  )
}

/** The privacy policy or the terms: a cream title band, then the contents beside the numbered sections. */
export const LegalDocument = ({ kind }: { kind: LegalKind }) => {
  const { store, t } = useStorefront()
  const contact = useContact()
  // The store's own name and contact details, so the text never repeats them by hand. The registered name and
  // address read in capitals, as the business is registered (and as the footer shows them).
  const sections = sectionsOf(
    t(`policies.${kind}.body`, {
      store: store.name,
      legalName: contact.legalName.toUpperCase(),
      address: contact.address.join(', ').toUpperCase(),
      taxId: contact.taxId,
      email: contact.email,
      phone: contact.phone,
    }),
  )
  return (
    <>
      <section className={styles.legalHero}>
        <div className={styles.legalDots} aria-hidden="true" />
        <div className={styles.legalHeroInner}>
          <p className={styles.legalEyebrow}>
            <span className={styles.legalEyebrowRule} aria-hidden="true" />
            {t('pages.legal.eyebrow')}
          </p>
          <h1 className={styles.legalTitle}>{t(`policies.${kind}.title`)}</h1>
          <p className={styles.legalUpdated}>{t('pages.legal.updated', { date: t(`policies.${kind}.updated`) })}</p>
        </div>
      </section>
      <div className={styles.legalBody}>
        <LegalSpy>
          <div className={styles.legalGrid}>
            <LegalToc label={t('pages.legal.toc')} sections={sections.map(({ id, title }) => ({ id, title }))} />
            <article className={styles.legalArticle}>
              {sections.map((section, i) => (
                <LegalSection key={section.id} id={section.id} className={styles.legalSection}>
                  <h2 className={styles.legalHeading}>
                    <span className={styles.legalNumber}>{String(i + 1).padStart(2, '0')}</span>
                    {section.title}
                  </h2>
                  <div className={styles.legalText}>
                    {section.blocks.map((block) => (
                      <Block key={block} text={block} />
                    ))}
                  </div>
                </LegalSection>
              ))}
            </article>
          </div>
        </LegalSpy>
      </div>
    </>
  )
}
