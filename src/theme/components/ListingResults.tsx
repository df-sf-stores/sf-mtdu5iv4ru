import { Link, useStorefront, type Listing } from '@dripfunnel/storefront-core/theme'
import { FilterPanel, ListingView } from './interactive/Filters'
import { Retry } from './interactive/Retry'
import { Notice } from './Notice'
import shop from '../styles/shop.module.css'
import styles from '../styles/listing.module.css'

/** A collection's or a search's products on the grey band: the filter card, then the bar, the grid and its states. */
export const ListingResults = ({ listing }: { listing: Listing }) => {
  const { t } = useStorefront()
  return (
    <div className={styles.band}>
      <div className={listing.facets.length || listing.priceBounds ? styles.layoutFiltered : styles.layout}>
        <FilterPanel listing={listing} />
        <ListingView listing={listing} loadingLabel={t('shop.listing.loading')}>
          {listing.status === 'error' ? (
            <Notice title={t('shop.listing.failed')} lead={t('shop.listing.failedLead')}>
              <Retry label={t('shop.listing.retry')} onRetry={listing.retry} />
            </Notice>
          ) : null}
          {listing.status === 'ready' && listing.items.length === 0 ? (
            listing.selected.length ? (
              <Notice title={t('shop.listing.empty')} lead={t('shop.listing.emptyLead')}>
                <Retry label={t('shop.listing.clear')} onRetry={listing.clear} />
              </Notice>
            ) : (
              <Notice title={t('shop.collection.empty')} lead={t('shop.collection.emptyLead')}>
                <Link href="/" className={shop.secondary}>
                  {t('shop.collection.home')}
                </Link>
              </Notice>
            )
          ) : null}
        </ListingView>
      </div>
    </div>
  )
}
