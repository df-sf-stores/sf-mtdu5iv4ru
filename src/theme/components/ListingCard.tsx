import { Image, Link, Price, useStorefront, type ProductCard } from '@dripfunnel/storefront-core/theme'
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
          <span className={styles.noPicture}>
            <svg className={styles.noPictureIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3.5" y="5" width="17" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.6" />
              <path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4" />
            </svg>
            {t('shop.card.noPicture')}
          </span>
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
