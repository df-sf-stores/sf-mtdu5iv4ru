import { Image, Link, Price, useStorefront, type ProductCard } from '@dripfunnel/storefront-core/theme'
import { NoPhoto } from './NoPhoto'
import styles from '../styles/landing.module.css'

/**
 * The home page's product card: photo, collection, name, price and stock, then Add to cart and Buy now. A card
 * carries no versions, so both buttons open the product, where the shopper picks a pack size and buys it.
 */
export const ShopCard = ({ product, label }: { product: ProductCard; label?: string | undefined }) => {
  const { store, locale, t } = useStorefront()
  return (
    <article className={styles.card}>
      <Link href={product.href} className={styles.cardPicture}>
        {product.photo ? <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={0.8} sizes="(min-width: 1024px) 358px, 50vw" className={styles.cardImage} /> : <NoPhoto label={t('shop.card.noPicture')} />}
        {product.badges[0] ? <span className={styles.cardBadge}>{product.badges[0].label}</span> : null}
      </Link>
      <div className={styles.cardBody}>
        {label ? <p className={styles.cardLabel}>{label}</p> : null}
        <h3 className={styles.cardName}>
          <Link href={product.href} className={styles.cardNameLink}>
            {product.name}
          </Link>
        </h3>
        <div className={styles.cardMeta}>
          {product.price ? (
            <p className={styles.cardPrice}>
              {product.from ? <span className={styles.cardFrom}>{t('shop.card.from')}</span> : null}
              <Price money={product.price} compareAt={product.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.price} />
            </p>
          ) : (
            <span />
          )}
          <p className={product.stock.inStock ? styles.stock : styles.stockOut}>
            <span className={styles.stockDot} aria-hidden="true" />
            {product.stock.inStock ? t('home.shop.inStock') : t('shop.card.soldOut')}
          </p>
        </div>
        <Link href={product.href} className={styles.addButton}>
          <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M5.5 8h13l-1 12h-11z" />
            <path d="M9 8V6.5a3 3 0 016 0V8" />
          </svg>
          {t('home.shop.add')}
        </Link>
        <Link href={product.href} className={styles.buyLink}>
          <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M13 3L5 14h6l-1 7 8-11h-6z" />
          </svg>
          {t('home.shop.buy')}
        </Link>
      </div>
    </article>
  )
}
