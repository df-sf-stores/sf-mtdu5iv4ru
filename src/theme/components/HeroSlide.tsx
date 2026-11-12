import type { ReactNode } from 'react'
import { Image, Link, StoreLogo, useListing, useStorefront, type CollectionCard, type ProductCard } from '@dripfunnel/storefront-core/theme'
import { slugOf } from './slugOf'
import styles from '../styles/hero.module.css'

export const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/**
 * A product's photo in a hero frame. The store's logo waits behind it, so a frame never stands empty: not while the
 * photo loads, not when a product has none, and not when its file can't be fetched.
 */
const Pack = ({ product, large }: { product: ProductCard | undefined; large: boolean }) => (
  <>
    <span className={styles.packMark} aria-hidden="true">
      <StoreLogo className={styles.packLogo} />
    </span>
    {product?.photo ? (
      large ? (
        <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={0.8} sizes="(min-width: 1024px) 452px, 80vw" className={styles.photo} />
      ) : (
        <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={0.8} sizes="(min-width: 1024px) 228px, 40vw" className={styles.photo} />
      )
    ) : null}
  </>
)

/** Two products in overlapping white frames, with the store's badge pinned to the large one. */
const Media = ({ main, side }: { main: ProductCard | undefined; side: ProductCard | undefined }) => {
  const { t } = useStorefront()
  return (
    <div className={styles.media}>
      <div className={styles.frameMain}>
        <Pack product={main} large />
      </div>
      <div className={styles.frameSide}>
        <Pack product={side} large={false} />
      </div>
      <span className={styles.badge}>
        <StoreLogo className={styles.badgeLogo} />
        {t('home.hero.badge')}
      </span>
    </div>
  )
}

const Copy = ({ eyebrow, title, body, children }: { eyebrow: ReactNode; title: ReactNode; body: ReactNode; children: ReactNode }) => (
  <div className={styles.copy}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.body}>{body}</p>
    <div className={styles.actions}>{children}</div>
  </div>
)

/** Two photographed products from a list, the second different from the first while the list allows. */
const pair = (own: ProductCard[], fallback: ProductCard[]) => {
  const pictured = [...own.filter((p) => p.photo), ...fallback.filter((p) => p.photo && !own.includes(p))]
  return { main: pictured[0], side: pictured[1] ?? pictured[0] }
}

/** The opening slide: the store's promise in three lines over its two newest photographed products. */
export const IntroSlide = ({ products }: { products: ProductCard[] }) => {
  const { store, t } = useStorefront()
  const { main, side } = pair(products, [])
  return (
    <div className={styles.slideGrid}>
      <Copy
        eyebrow={t('home.hero.intro.eyebrow', { store: store.name })}
        title={
          <>
            <span className={styles.line}>{t('home.hero.intro.first')}</span>
            <span className={styles.lineGold}>{t('home.hero.intro.second')}</span>
            <span className={styles.line}>{t('home.hero.intro.third')}</span>
          </>
        }
        body={t('home.hero.intro.body', { store: store.name })}
      >
        <Link href="/collections/all/" className={styles.primary}>
          {t('home.hero.intro.shop')}
          <ArrowRight className={styles.buttonIcon} />
        </Link>
        <Link href="/#shop-by-category" className={styles.secondary}>
          {t('home.hero.intro.explore')}
        </Link>
      </Copy>
      <Media main={main} side={side} />
    </div>
  )
}

/**
 * A collection's slide: its name, words and product count beside two of its own products. A collection without
 * photographed products shows the store's logo in its frames rather than another collection's packs.
 */
export const HeroSlide = ({ collection }: { collection: CollectionCard }) => {
  const { store, t } = useStorefront()
  const listing = useListing({ collection: slugOf(collection) })
  const { main, side } = pair(listing.items, [])
  const count = listing.items.length
  return (
    <div className={styles.slideGrid}>
      <Copy
        eyebrow={listing.status === 'ready' && count ? t('home.hero.eyebrowCount', { store: store.name, count }) : t('home.hero.eyebrow', { store: store.name })}
        title={collection.name}
        body={collection.description || t('home.hero.body', { name: collection.name })}
      >
        <Link href={collection.href} className={styles.primary}>
          {t('home.hero.shop', { name: collection.name })}
          <ArrowRight className={styles.buttonIcon} />
        </Link>
        <Link href="/collections/all/" className={styles.secondary}>
          {t('home.hero.explore')}
        </Link>
      </Copy>
      <Media main={main} side={side} />
    </div>
  )
}
