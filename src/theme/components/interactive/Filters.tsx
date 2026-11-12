'use client'

import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { Checkbox, PriceRange, Select, useLoadOnScroll, useStorefront, type Listing, type ProductCard, type SortKey } from '@dripfunnel/storefront-core/theme'
import { ListingCard } from '../ListingCard'
import shop from '../../styles/shop.module.css'
import styles from '../../styles/listing.module.css'

const Chevron = ({ open }: { open: boolean }) => (
  <svg className={open ? styles.chevronOpen : styles.chevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6 15l6-6 6 6" />
  </svg>
)

/** One group of filters with a heading that shows or hides it, open to begin with. */
const Group = ({ name, children }: { name: string; children: ReactNode }) => {
  const { t } = useStorefront()
  const id = useId()
  const [open, setOpen] = useState(true)
  return (
    <div role="group" aria-label={name} className={styles.group}>
      <button type="button" className={styles.groupToggle} aria-expanded={open} aria-controls={id} aria-label={t('shop.listing.toggleGroup', { name })} onClick={() => setOpen(!open)}>
        <span aria-hidden="true">{name}</span>
        <Chevron open={open} />
      </button>
      <div id={id} className={styles.groupBody} hidden={!open}>
        {children}
      </div>
    </div>
  )
}

/** The filter values and the price range: a card beside the products on wide screens, a panel the Filters button opens on narrow ones. */
export const FilterPanel = ({ listing }: { listing: Listing }) => {
  const { t } = useStorefront()
  const [open, setOpen] = useState(false)
  if (listing.facets.length === 0 && !listing.priceBounds) return null
  const priced = listing.priceRange.min !== null || listing.priceRange.max !== null
  const chosen = listing.selected.length + Number(priced)
  return (
    <aside className={styles.filters}>
      <button type="button" className={styles.filterToggle} aria-expanded={open} aria-controls="listing-filters" onClick={() => setOpen(!open)}>
        <svg className={styles.toggleIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        {open ? t('shop.listing.filtersShown') : t('shop.listing.filters')}
        {chosen ? <span className={styles.chosen}>{chosen}</span> : null}
      </button>
      <div id="listing-filters" className={open ? styles.filterCardOpen : styles.filterCard}>
        <p className={styles.filterTitle}>{t('shop.listing.filters')}</p>
        {listing.facets.map((facet) => (
          <Group key={facet.id} name={facet.name}>
            {facet.values.map((value) => (
              <Checkbox key={value.id} checked={value.selected} onChange={() => listing.toggle(value.id)} className={styles.check}>
                <span className={styles.checkName}>{value.name}</span>
                <span className={styles.checkCount}>{value.count}</span>
              </Checkbox>
            ))}
          </Group>
        ))}
        {listing.priceBounds ? (
          <Group name={t('shop.listing.price')}>
            <PriceRange
              bounds={listing.priceBounds}
              value={listing.priceRange}
              onChange={listing.setPriceRange}
              label={t('shop.listing.price')}
              className={shop.priceRange}
              parts={{ track: shop.priceTrack, rail: shop.priceRail, fill: shop.priceFill, tick: shop.priceTick, thumb: shop.priceThumb, ends: shop.priceEnds, select: shop.priceSelect, to: shop.priceTo }}
            />
          </Group>
        ) : null}
      </div>
    </aside>
  )
}

const GridIcon = () => (
  <svg className={styles.viewIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
)

const ListIcon = () => (
  <svg className={styles.viewIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
  </svg>
)

/**
 * The products and the bar above them: how many show, the sort, grid or list, and the chosen filters as chips that
 * each remove one. `children` are the listing's notices (loading failed, nothing matches), shown under the bar.
 */
export const ListingView = ({ listing, loadingLabel, children }: { listing: Listing; loadingLabel: string; children: ReactNode }) => {
  const { t } = useStorefront()
  const [list, setList] = useState(false)
  const labels: Record<SortKey, string> = {
    featured: t('shop.listing.sorts.featured'),
    newest: t('shop.listing.sorts.newest'),
    'price-low': t('shop.listing.sorts.priceLow'),
    'price-high': t('shop.listing.sorts.priceHigh'),
    name: t('shop.listing.sorts.name'),
  }
  const items: readonly ProductCard[] = listing.status === 'ready' ? listing.items : []
  return (
    <div className={styles.results}>
      <h2 className={styles.hidden}>{t('shop.listing.heading')}</h2>
      {listing.status === 'ready' ? (
        <div className={styles.toolbar}>
          <p className={styles.count} role="status">
            {t('shop.listing.showing', { count: listing.items.length })}
          </p>
          <div className={styles.tools}>
            <Select label={t('shop.listing.sortShort')} value={listing.sort} options={listing.sorts.map((s) => ({ value: s, label: labels[s] }))} onChange={listing.setSort} className={styles.sort} />
            <div className={styles.views} role="group" aria-label={t('shop.listing.views')}>
              <button type="button" className={list ? styles.viewButton : styles.viewButtonOn} aria-pressed={!list} aria-label={t('shop.listing.grid')} onClick={() => setList(false)}>
                <GridIcon />
              </button>
              <button type="button" className={list ? styles.viewButtonOn : styles.viewButton} aria-pressed={list} aria-label={t('shop.listing.list')} onClick={() => setList(true)}>
                <ListIcon />
              </button>
            </div>
          </div>
          {listing.selected.length ? (
            <div className={styles.chips}>
              {listing.selected.map((s) => (
                <button key={s.id} type="button" className={styles.chip} aria-label={t('shop.listing.remove', { name: s.name })} onClick={() => listing.toggle(s.id)}>
                  {s.name}
                  <svg className={styles.chipIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              ))}
              {listing.selected.length > 1 ? (
                <button type="button" className={styles.clear} onClick={listing.clear}>
                  {t('shop.listing.clear')}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
      {listing.status === 'loading' ? (
        <ul className={styles.grid} aria-busy="true" aria-label={loadingLabel}>
          {[...Array(8).keys()].map((i) => (
            <li key={i} className={styles.skeleton} />
          ))}
        </ul>
      ) : null}
      {children}
      {items.length ? (
        <ul className={list ? styles.list : styles.grid}>
          {items.map((p) => (
            <li key={p.id} className={styles.cell}>
              <ListingCard product={p} />
            </li>
          ))}
        </ul>
      ) : null}
      <MoreOnScroll listing={listing} />
    </div>
  )
}

/** Infinite scroll: the next page loads as the end of the grid nears the screen, and a page that didn't load offers a retry. */
export const MoreOnScroll = ({ listing }: { listing: Listing }) => {
  const { t } = useStorefront()
  const end = useLoadOnScroll(listing)
  return (
    <div ref={end} className={shop.more}>
      {listing.loadingMore ? (
        <p className={shop.muted} role="status">
          {t('shop.listing.loadingMore')}
        </p>
      ) : null}
      {listing.moreFailed ? (
        <>
          <p className={shop.muted} role="alert">
            {t('shop.listing.moreFailed')}
          </p>
          <button type="button" className={shop.secondary} onClick={listing.fetchMore}>
            {t('shop.listing.retry')}
          </button>
        </>
      ) : null}
    </div>
  )
}
