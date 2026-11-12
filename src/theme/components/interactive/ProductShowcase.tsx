'use client'

import { useState } from 'react'
import { Link, useListing, useStorefront, type CollectionCard } from '@dripfunnel/storefront-core/theme'
import { ArrowRight } from '../HeroSlide'
import { ShopCard } from '../ShopCard'
import { cx } from '../cx'
import { slugOf } from '../slugOf'
import styles from '../../styles/landing.module.css'

const shown = 8

/** "Shop our spices": a pill per collection over a grid of up to eight of the chosen collection's products. */
export const ProductShowcase = ({ collections, labels }: { collections: CollectionCard[]; labels: Map<string, string> }) => {
  const { t } = useStorefront()
  const [chosen, setChosen] = useState<CollectionCard | null>(null)
  const listing = useListing({ collection: chosen ? slugOf(chosen) : null })
  const loading = listing.status === 'loading' || listing.status === 'idle'
  return (
    <>
      {collections.length ? (
        <div className={styles.pills} role="group" aria-label={t('home.shop.filter')}>
          <button type="button" className={cx(styles.filterPill, chosen === null && styles.filterOn)} aria-pressed={chosen === null} onClick={() => setChosen(null)}>
            {t('home.shop.all')}
          </button>
          {collections.map((c) => (
            <button key={c.id} type="button" className={cx(styles.filterPill, chosen?.id === c.id && styles.filterOn)} aria-pressed={chosen?.id === c.id} onClick={() => setChosen(c)}>
              {c.name}
            </button>
          ))}
        </div>
      ) : null}
      {loading ? (
        <ul className={styles.productGrid} aria-busy="true" aria-label={t('shop.listing.loading')}>
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className={styles.skeleton} />
          ))}
        </ul>
      ) : listing.items.length ? (
        <ul className={styles.productGrid}>
          {listing.items.slice(0, shown).map((product) => (
            <li key={product.id} className={styles.productCell}>
              <ShopCard product={product} label={chosen?.name ?? labels.get(product.id)} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyNote}>{t('home.newestEmpty')}</p>
      )}
      <div className={styles.more}>
        <Link href={chosen ? chosen.href : '/collections/all/'} className={styles.outlineButton}>
          {chosen ? t('home.hero.shop', { name: chosen.name }) : t('home.viewAll')}
          <ArrowRight className={styles.buttonIcon} />
        </Link>
      </div>
    </>
  )
}
