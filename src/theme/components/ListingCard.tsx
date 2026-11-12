import { Image, Link, Price, useStorefront, type ProductCard } from '@dripfunnel/storefront-core/theme'
import { NoPhoto } from './NoPhoto'
import styles from '../styles/listing.module.css'

const Arrow = () => (
  <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/**
 * A product in the shop's listings (Shop All, a collection, a search): its photo on white, name, price and a link
 * to the product, where the shopper picks a pack size. A product without a photo says so; the logo never stands in.
 */
export const ListingCard = ({ product }: { product: ProductCard }) => {
  const { store, locale, t } = useStorefront()
  return (
    <article className={styles.card}>
      <Link href={product.href} className={styles.picture}>
        {product.photo ? (
          <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={1} sizes="(min-width: 1280px) 240px, (min-width: 768px) 30vw, 45vw" className={styles.image} />
        ) : (
          <NoPhoto label={t('shop.card.noPicture')} />
        )}
        {product.badges[0] ? <span className={styles.badge}>{product.badges[0].label}</span> : null}
      </Link>
      <div className={styles.body}>
        <h3 className={styles.name}>
          <Link href={product.href} className={styles.nameLink}>
            {product.name}
          </Link>
        </h3>
        {product.price ? (
          <p className={styles.priceLine}>
            {product.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
            <Price money={product.price} compareAt={product.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.price} />
          </p>
        ) : null}
        {product.stock.inStock ? null : <p className={styles.soldOut}>{t('shop.card.soldOut')}</p>}
        <Link href={product.href} className={styles.view}>
          {t('shop.card.viewProduct')}
          <Arrow />
        </Link>
      </div>
    </article>
  )
}
