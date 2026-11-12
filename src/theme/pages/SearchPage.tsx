import { Link, SearchField, useCollections, useSearch, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { ListingResults } from '../components/ListingResults'
import { Notice } from '../components/Notice'
import shop from '../styles/shop.module.css'
import styles from '../styles/listing.module.css'

export const SearchPage = () => {
  const { t } = useStorefront()
  const search = useSearch()
  const { collections } = useCollections({ first: 6 })
  const none = search.status === 'ready' && search.items.length === 0 && search.selected.length === 0
  return (
    <Layout>
      <section>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.title}>{search.query ? t('shop.search.results', { query: search.query }) : t('shop.search.title')}</h1>
            {search.query ? null : <p className={styles.lead}>{t('shop.search.lead')}</p>}
            <SearchField label={t('shop.search.label')} placeholder={t('shop.search.placeholder')} button={t('shop.search.button')} value={search.query} onSearch={search.setQuery} className={shop.search} />
          </div>
        </header>
        {none ? (
          <div className={styles.band}>
            <div className={styles.wrap}>
              <Notice title={t('shop.search.none', { query: search.query })} lead={t('shop.search.noneLead')}>
                {collections.map((c) => (
                  <Link key={c.id} href={c.href} className={shop.chipLink}>
                    {c.name}
                  </Link>
                ))}
              </Notice>
            </div>
          </div>
        ) : search.status === 'idle' ? null : (
          <ListingResults listing={search} />
        )}
      </section>
    </Layout>
  )
}
