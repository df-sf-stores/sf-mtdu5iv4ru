import { Breadcrumbs, Link, useCollection, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { ListingResults } from '../components/ListingResults'
import { Notice } from '../components/Notice'
import { Retry } from '../components/interactive/Retry'
import shop from '../styles/shop.module.css'
import styles from '../styles/listing.module.css'

export const CollectionPage = () => {
  const { t } = useStorefront()
  const page = useCollection()
  const name = page.collection?.name ?? (page.all ? t('shop.collection.all') : null)
  const crumb = page.collection?.name ?? (page.all ? t('shop.collection.allCrumb') : null)
  const lead = page.collection ? page.collection.description : page.all ? t('shop.collection.allLead') : null
  return (
    <Layout>
      {page.found === 'missing' ? (
        <section className={styles.wrap}>
          <Notice main title={t('shop.collection.missing')} lead={t('shop.collection.missingLead')}>
            <Link href="/collections/all/" className={shop.primary}>
              {t('shop.collection.browse')}
            </Link>
          </Notice>
        </section>
      ) : page.found === 'error' ? (
        <section className={styles.wrap}>
          <Notice main title={t('shop.listing.failed')} lead={t('shop.listing.failedLead')}>
            <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
          </Notice>
        </section>
      ) : (
        <section>
          <header className={styles.hero}>
            <div className={styles.heroInner}>
              <Breadcrumbs crumbs={crumb ? [{ label: t('shop.crumbs.home'), href: '/' }, { label: crumb, href: page.collection?.href ?? '/collections/all/' }] : []} t={t} className={styles.crumbs} />
              <h1 className={styles.title}>{name ?? t('shop.collection.loading')}</h1>
              {lead ? <p className={styles.lead}>{lead}</p> : null}
            </div>
          </header>
          <ListingResults listing={page} />
        </section>
      )}
    </Layout>
  )
}
