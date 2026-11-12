import type { ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { ShopCard } from './ShopCard'
import styles from '../styles/shop.module.css'

/** Every product grid uses the home page's card, so a product looks the same wherever it is listed. */
export const ProductCard = ({ product }: { product: Card }) => <ShopCard product={product} />

export const ProductGrid = ({ products, wide = false }: { products: readonly Card[]; wide?: boolean }) => (
  <ul className={wide ? styles.gridWide : styles.grid}>
    {products.map((p) => (
      <li key={p.id} className={styles.cell}>
        <ProductCard product={p} />
      </li>
    ))}
  </ul>
)

/** The grid's shape while its products load, so nothing moves when they arrive. */
export const GridPlaceholder = ({ label, count }: { label: string; count: number }) => (
  <ul className={styles.grid} aria-busy="true" aria-label={label}>
    {[...Array(count).keys()].map((i) => (
      <li key={i} className={styles.cell}>
        <div className={styles.skeletonPicture} />
        <div className={styles.skeletonLine} />
      </li>
    ))}
  </ul>
)
