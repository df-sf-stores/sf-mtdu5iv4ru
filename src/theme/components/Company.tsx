import type { ReactNode } from 'react'
import { Image, Link, StoreLogo, useProducts, useStorefront, type ProductCard } from '@dripfunnel/storefront-core/theme'
import { CategoryIcon, iconFor } from './CategoryIcon'
import { ArrowRight } from './HeroSlide'
import { cx } from './cx'
import styles from '../styles/company.module.css'

/**
 * The pieces the About, Our Story and Vision & Mission pages are built from, after the live site: a cream hero
 * with a framed pack, white and cream bands, fact tiles, the product range, numbered values, a burgundy closing
 * band and the strip that leads on to the next page.
 */

/** Lines of a content string split on '|', blanks dropped. */
export const listOf = (text: string) =>
  text
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)

/** The store's newest photographed products, for the frames. */
export const usePictured = () => {
  const { products, status } = useProducts({ sort: 'newest', first: 12 })
  return { pictured: products.filter((p) => p.photo), count: products.length, ready: status === 'ready' }
}

export const Eyebrow = ({ children, centered = false, light = false }: { children: ReactNode; centered?: boolean; light?: boolean }) => (
  <p className={cx(styles.eyebrow, centered && styles.eyebrowCentered, light && styles.eyebrowLight)}>{children}</p>
)

/** A product's photo in a frame, the store's logo waiting behind it. */
export const Framed = ({ product, className, large }: { product: ProductCard | undefined; className: string | undefined; large: boolean }) => (
  <div className={className}>
    <span className={styles.mark} aria-hidden="true">
      <StoreLogo className={styles.markLogo} />
    </span>
    {product?.photo ? (
      large ? (
        <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={0.8} sizes="(min-width: 1024px) 330px, 70vw" className={styles.photo} />
      ) : (
        <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={0.8} sizes="(min-width: 1024px) 200px, 45vw" className={styles.photo} />
      )
    ) : null}
  </div>
)

export const CompanyHero = ({
  eyebrow,
  title,
  tagline,
  lead,
  chips,
  action,
  caption,
  product,
}: {
  eyebrow: string
  title: string
  tagline?: string
  lead: string
  chips?: string[]
  action: { href: string; label: string }
  caption: string
  product: ProductCard | undefined
}) => (
  <section className={styles.hero}>
    <div className={cx(styles.wrap, styles.heroGrid)}>
      <div className={styles.heroCopy}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className={styles.heroTitle}>{title}</h1>
        {tagline ? <p className={styles.heroTagline}>{tagline}</p> : null}
        <p className={styles.heroLead}>{lead}</p>
        {chips?.length ? (
          <ul className={styles.chips}>
            {chips.map((chip, index) => (
              <li key={chip} className={styles.chip}>
                <svg className={styles.chipIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  {index === 0 ? (
                    <>
                      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" />
                      <circle cx="12" cy="10" r="2.3" />
                    </>
                  ) : (
                    <path d="M5 11h14l-1.5 8h-11zM9 11V8a3 3 0 016 0v3" />
                  )}
                </svg>
                {chip}
              </li>
            ))}
          </ul>
        ) : null}
        <Link href={action.href} className={styles.solidButton}>
          {action.label}
          <ArrowRight className={styles.buttonIcon} />
        </Link>
      </div>
      <div className={styles.heroMedia}>
        <Framed product={product} className={styles.heroFrame} large />
        <div className={styles.logoCard}>
          <StoreLogo className={styles.logoCardImage} />
          <p className={styles.logoCardText}>{caption}</p>
        </div>
      </div>
    </div>
  </section>
)

export const Band = ({ tone = 'white', children }: { tone?: 'white' | 'cream'; children: ReactNode }) => (
  <section className={tone === 'cream' ? styles.bandCream : styles.band}>
    <div className={styles.wrap}>{children}</div>
  </section>
)

export const Heading = ({ eyebrow, title, lead, centered = false }: { eyebrow: string; title: string; lead?: string; centered?: boolean }) => (
  <div className={centered ? styles.headCentered : styles.head}>
    <Eyebrow centered={centered}>{eyebrow}</Eyebrow>
    <h2 className={styles.title}>{title}</h2>
    {lead ? <p className={styles.lead}>{lead}</p> : null}
  </div>
)

/** Two products in overlapping frames beside the section's words. */
export const Split = ({ products, children }: { products: ProductCard[]; children: ReactNode }) => (
  <div className={styles.split}>
    <div className={styles.splitMedia}>
      <Framed product={products[1] ?? products[0]} className={styles.splitFrame} large={false} />
      <Framed product={products[2]} className={styles.splitFrameBack} large={false} />
    </div>
    <div className={styles.splitCopy}>{children}</div>
  </div>
)

export const Facts = ({ items }: { items: { label: string; value: string; icon: ReactNode }[] }) => (
  <dl className={styles.facts}>
    {items.map((item) => (
      <div key={item.label} className={styles.fact}>
        <span className={styles.factIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            {item.icon}
          </svg>
        </span>
        <div>
          <dt className={styles.factLabel}>{item.label}</dt>
          <dd className={styles.factValue}>{item.value}</dd>
        </div>
      </div>
    ))}
  </dl>
)

/**
 * The range: one card per line of `text` ('Name: words'), with the photo of a product whose name holds the range's
 * name when the shop sells one, and a link to search the shop for it.
 */
export const Range = ({ text, products }: { text: string; products: ProductCard[] }) => {
  const { t } = useStorefront()
  const ranges = text
    .split('\n')
    .map((line) => {
      const [name = '', ...words] = line.split(': ')
      return { name: name.trim(), words: words.join(': ').trim() }
    })
    .filter((r) => r.name)
  return (
    <ul className={styles.range}>
      {ranges.map((range) => {
        const word = (range.name.split(' ')[0] ?? '').toLowerCase().replace(/s$/, '')
        const product = products.find((p) => p.photo && p.name.toLowerCase().includes(word))
        return (
          <li key={range.name} className={styles.rangeCard}>
            <div className={styles.rangePicture}>
              {product?.photo ? (
                <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={1.6} sizes="(min-width: 1024px) 400px, 90vw" className={styles.photo} />
              ) : (
                <span className={styles.rangeIcon}>
                  <CategoryIcon kind={iconFor(range.name)} className={styles.rangeSvg} />
                </span>
              )}
            </div>
            <div className={styles.rangeBody}>
              <h3 className={styles.rangeName}>
                <CategoryIcon kind={iconFor(range.name)} className={styles.rangeMini} />
                {range.name}
              </h3>
              <p className={styles.rangeWords}>{range.words}</p>
              {product ? (
                <Link href={product.href} className={styles.rangeLink}>
                  {t('pages.company.shopRange')}
                  <ArrowRight className={styles.buttonIcon} />
                </Link>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** Numbered value cards, from content blocks 'Title\nwords' split by a blank line. */
export const Values = ({ text }: { text: string }) => {
  const values = text
    .split('\n\n')
    .map((block) => block.split('\n'))
    .flatMap(([title = '', ...words]) => (title ? [{ title, words: words.join(' ') }] : []))
  return (
    <ol className={styles.values}>
      {values.map((value, index) => (
        <li key={value.title} className={styles.value}>
          <div className={styles.valueTop}>
            <span className={styles.valueIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                {index === 0 ? <path d="M12 3.5l1.6 4.4 4.4 1.6-4.4 1.6L12 15.5l-1.6-4.4L6 9.5l4.4-1.6zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" /> : null}
                {index === 1 ? <path d="M5 11h14a7 7 0 01-14 0zM9 7c0-1.5 1-2 1-3.5M13 7c0-1.5 1-2 1-3.5M8 20h8" /> : null}
                {index >= 2 ? <path d="M4 10h16M5 10l1-5h12l1 5M5 10v10h14V10M9 20v-5h6v5" /> : null}
              </svg>
            </span>
            <span className={styles.valueNumber} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <h3 className={styles.valueTitle}>{value.title}</h3>
          <p className={styles.valueWords}>{value.words}</p>
        </li>
      ))}
    </ol>
  )
}

export const Closing = ({ title, body, primary, secondary }: { title: string; body: string; primary: { href: string; label: string }; secondary: { href: string; label: string } }) => (
  <section className={styles.closing}>
    <div className={styles.closingInner}>
      <StoreLogo className={styles.closingLogo} />
      <h2 className={styles.closingTitle}>{title}</h2>
      <p className={styles.closingBody}>{body}</p>
      <div className={styles.closingActions}>
        <Link href={primary.href} className={styles.goldButton}>
          {primary.label}
          <ArrowRight className={styles.buttonIcon} />
        </Link>
        <Link href={secondary.href} className={styles.ghostButton}>
          {secondary.label}
        </Link>
      </div>
    </div>
  </section>
)

export const NextPage = ({ title, body, action }: { title: string; body: string; action: { href: string; label: string } }) => (
  <section className={styles.next}>
    <div className={cx(styles.wrap, styles.nextInner)}>
      <div>
        <h2 className={styles.nextTitle}>{title}</h2>
        <p className={styles.nextBody}>{body}</p>
      </div>
      <Link href={action.href} className={styles.solidButton}>
        {action.label}
        <ArrowRight className={styles.buttonIcon} />
      </Link>
    </div>
  </section>
)

export const companyStyles = styles
