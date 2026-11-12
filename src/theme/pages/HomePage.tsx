import type { ReactNode } from 'react'
import { Image, Link, StoreLogo, useCollections, useListing, useProducts, useStorefront, type CollectionCard, type ProductCard } from '@dripfunnel/storefront-core/theme'
import { ArrowRight, HeroSlide, IntroSlide } from '../components/HeroSlide'
import { FaqAccordion } from '../components/interactive/FaqAccordion'
import { HeroCarousel } from '../components/interactive/HeroCarousel'
import { ProductShowcase } from '../components/interactive/ProductShowcase'
import { Layout, chatPath } from '../components/Layout'
import { useContact } from '../components/contact'
import { cx } from '../components/cx'
import { groupsOf } from '../components/faqGroups'
import { slugOf } from '../components/slugOf'
import styles from '../styles/landing.module.css'

type Probe = { collection: CollectionCard | undefined; ready: boolean; items: ProductCard[] }

/** A collection's products, asked once and shared with every card, pill and slide that names the same collection. */
const useProbe = (collection: CollectionCard | undefined): Probe => {
  const listing = useListing({ collection: collection ? slugOf(collection) : null }, collection !== undefined)
  return { collection, ready: collection === undefined || listing.status === 'ready' || listing.status === 'error', items: listing.items }
}

/**
 * The collections that hold products, in the store's order, as the live site shows them: the hero, the category
 * cards, the filter pills and the offers skip an empty collection. Up to eight are asked; while none holds a product
 * yet, every collection is shown so the page never stands empty.
 */
const useStocked = (categories: CollectionCard[]) => {
  const probes = [useProbe(categories[0]), useProbe(categories[1]), useProbe(categories[2]), useProbe(categories[3]), useProbe(categories[4]), useProbe(categories[5]), useProbe(categories[6]), useProbe(categories[7])]
  const ready = probes.every((p) => p.ready)
  const counts = new Map(probes.flatMap((p) => (p.collection ? [[p.collection.id, p.items.length] as const] : [])))
  const stocked = probes.flatMap((p) => (p.collection && p.items.length ? [p.collection] : []))
  // Each product's first collection, named on its card as the live site does.
  const labels = new Map<string, string>()
  for (const p of probes) for (const item of p.items) if (p.collection && !labels.has(item.id)) labels.set(item.id, p.collection.name)
  return { ready, counts, labels, stocked: ready && stocked.length === 0 ? categories : stocked }
}

const Trust = ({ title, body, children }: { title: string; body: string; children: ReactNode }) => (
  <li className={styles.trustItem}>
    <span className={styles.trustIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {children}
      </svg>
    </span>
    <span className={styles.trustText}>
      <span className={styles.trustTitle}>{title}</span>
      <span className={styles.trustBody}>{body}</span>
    </span>
  </li>
)

const Eyebrow = ({ children, centered = false }: { children: ReactNode; centered?: boolean }) => <p className={cx(styles.eyebrow, centered && styles.eyebrowCentered)}>{children}</p>

/** A collection as a tall picture card with its name, product count and words. */
const CategoryCard = ({ collection, count }: { collection: CollectionCard; count: number | undefined }) => {
  const { t } = useStorefront()
  const listing = useListing({ collection: slugOf(collection) })
  const picture = collection.image ?? listing.items.find((p) => p.photo)?.photo ?? null
  return (
    <li>
      <Link href={collection.href} className={styles.category}>
        <span className={styles.categoryPicture}>
          <span className={styles.pictureMark} aria-hidden="true">
            <StoreLogo className={styles.markLogo} />
          </span>
          {picture ? <Image image={picture} alt="" ratio={0.8} sizes="(min-width: 1024px) 234px, 45vw" className={styles.fill} /> : null}
        </span>
        <span className={styles.categoryHead}>
          <span className={styles.categoryName}>{collection.name}</span>
          <ArrowRight className={styles.categoryArrow} />
        </span>
        <span className={styles.categoryCount}>{count === undefined ? null : t('home.categories.count', { count })}</span>
        <span className={styles.categoryBody}>{collection.description || t('home.categories.body', { name: collection.name })}</span>
      </Link>
    </li>
  )
}

/** One of the two offer cards under the product grid. */
const PromoCard = ({ collection, count, tone }: { collection: CollectionCard; count: number | undefined; tone: 'rich' | 'fresh' }) => {
  const { t } = useStorefront()
  const listing = useListing({ collection: slugOf(collection) })
  const picture = collection.image ?? listing.items.find((p) => p.photo)?.photo ?? null
  return (
    <article className={tone === 'rich' ? styles.promoRich : styles.promoFresh}>
      <div className={styles.promoCopy}>
        <p className={styles.promoTag}>{count ? t('home.promo.tagCount', { name: collection.name, count }) : collection.name}</p>
        <h3 className={styles.promoTitle}>{t(tone === 'rich' ? 'home.promo.rich.title' : 'home.promo.fresh.title')}</h3>
        <p className={styles.promoBody}>{collection.description || t(tone === 'rich' ? 'home.promo.rich.body' : 'home.promo.fresh.body')}</p>
        <Link href={collection.href} className={tone === 'rich' ? styles.goldButton : styles.greenButton}>
          {t('home.hero.shop', { name: collection.name })}
          <ArrowRight className={styles.buttonIcon} />
        </Link>
      </div>
      <div className={styles.promoPicture}>
        <span className={styles.pictureMark} aria-hidden="true">
          <StoreLogo className={styles.markLogo} />
        </span>
        {picture ? <Image image={picture} alt="" ratio={0.9} sizes="(min-width: 1024px) 370px, 90vw" className={styles.fill} /> : null}
      </div>
    </article>
  )
}

/** Reviews from content: one block per review, its first line 'Name' or 'Name | Label', then the reviewer's words. */
const reviewsOf = (text: string) =>
  text
    .split('\n\n')
    .map((block) => block.split('\n'))
    .flatMap(([head = '', ...words]) => {
      const [name = '', label = ''] = head.split(' | ')
      return name && words.length ? [{ name, label, words: words.join(' ') }] : []
    })

const GoogleMark = ({ className }: { className: string | undefined }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path className={styles.gBlue} d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z" />
    <path className={styles.gGreen} d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0012 22z" />
    <path className={styles.gYellow} d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 000 9.2z" />
    <path className={styles.gRed} d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 003.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6z" />
  </svg>
)

const Reviews = () => {
  const { store, t } = useStorefront()
  const reviews = reviewsOf(t('home.reviews.list', { store: store.name }))
  if (!reviews.length) return null
  return (
    <section className={styles.reviews}>
      <div className={styles.wrap}>
        <div className={styles.headRow}>
          <div>
            <Eyebrow>{t('home.reviews.eyebrow')}</Eyebrow>
            <h2 className={styles.title}>{t('home.reviews.title')}</h2>
            <p className={styles.subtitle}>{t('home.reviews.lead', { store: store.name })}</p>
          </div>
          <Link href={t('home.reviews.address')} className={styles.reviewsBadge}>
            <GoogleMark className={styles.reviewsBadgeMark} />
            <span className={styles.reviewsBadgeText}>{t('home.reviews.source')}</span>
          </Link>
        </div>
        <ul className={styles.reviewGrid}>
          {reviews.map((review) => (
            <li key={review.name} className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <GoogleMark className={styles.reviewMark} />
                <svg className={styles.quoteMark} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M10 7H6.5A1.5 1.5 0 005 8.5V12h4v5H4v-5M20 7h-3.5A1.5 1.5 0 0015 8.5V12h4v5h-5v-5" />
                </svg>
              </div>
              <blockquote className={styles.reviewWords}>{review.words}</blockquote>
              <div className={styles.reviewer}>
                <span className={styles.avatar} aria-hidden="true">
                  {review.name.slice(0, 1)}
                </span>
                <span className={styles.reviewerText}>
                  <span className={styles.reviewerName}>{review.name}</span>
                  {review.label ? <span className={styles.reviewerLabel}>{review.label}</span> : null}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.reviewsFoot}>
          <p className={styles.reviewsFrom}>
            <GoogleMark className={styles.reviewsFromMark} />
            {t('home.reviews.from')}
          </p>
          <Link href={t('home.reviews.address')} className={styles.textLink}>
            {t('home.reviews.all')}
            <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M14 5h5v5M19 5l-8 8M17 14v4a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export const HomePage = () => {
  const { store, t } = useStorefront()
  const contact = useContact()
  const { collections: categories, status } = useCollections({ first: 20 })
  const { ready, counts, labels, stocked } = useStocked(categories)
  const newest = useProducts({ sort: 'newest', first: 12 })
  const photographed = newest.products.filter((p) => p.photo)
  const storyProduct = photographed.at(-1)
  const heroCollections = ready ? stocked.slice(0, 2) : []
  const promoRich = stocked[2] ?? stocked[0]
  const promoFresh = stocked[3] ?? stocked[1]
  const faqs = groupsOf(t('home.faq.body', { store: store.name })).flatMap((g) => g.items)
  const portfolio = t('home.story.portfolioList')
    .split('|')
    .map((tag) => tag.trim())
    .filter(Boolean)
  return (
    <Layout>
      <h1 className={styles.hidden}>{t('home.title')}</h1>
      <HeroCarousel
        slides={[
          { key: 'intro', content: <IntroSlide products={photographed} /> },
          ...heroCollections.map((c) => ({
            key: c.id,
            content: <HeroSlide collection={c} />,
          })),
        ]}
        labels={{
          region: t('home.hero.region'),
          role: t('home.hero.role'),
          slide: t('home.hero.slide'),
          previous: t('home.hero.previous'),
          next: t('home.hero.next'),
          pause: t('home.hero.pause'),
          play: t('home.hero.play'),
          goTo: (n) => t('home.hero.goTo', { n }),
        }}
      />

      <section className={styles.trust}>
        <h2 className={styles.hidden}>{t('home.promises.title')}</h2>
        <ul className={styles.trustList}>
          <Trust title={t('home.promises.craft.title')} body={t('home.promises.craft.body')}>
            <path d="M12 3.5l1.6 4.4 4.4 1.6-4.4 1.6L12 15.5l-1.6-4.4L6 9.5l4.4-1.6zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8zM5.5 15.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" />
          </Trust>
          <Trust title={t('home.promises.stage.title')} body={t('home.promises.stage.body')}>
            <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
            <path d="M9 12l2 2 4-4" />
          </Trust>
          <Trust title={t('home.promises.secure.title')} body={t('home.promises.secure.body')}>
            <rect x="5" y="10.5" width="14" height="10" rx="2" />
            <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5M12 14.5v2" />
          </Trust>
          <Trust title={t('home.promises.support.title')} body={t('home.promises.support.body')}>
            <path d="M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2zM17 16v1a3 3 0 01-3 3h-2" />
          </Trust>
        </ul>
      </section>

      {status === 'loading' || categories.length ? (
        <section className={styles.categories} id="shop-by-category">
          <div className={styles.wrap}>
            <div className={styles.headRow}>
              <div>
                <Eyebrow>{t('home.categories.eyebrow')}</Eyebrow>
                <h2 className={styles.title}>{t('home.categories.title')}</h2>
                <p className={styles.subtitle}>{t('home.categories.lead')}</p>
              </div>
              <Link href="/collections/all/" className={styles.textLink}>
                {t('home.categories.all')}
                <ArrowRight className={styles.buttonIcon} />
              </Link>
            </div>
            <ul className={styles.categoryGrid} aria-busy={!ready}>
              {ready
                ? stocked.map((c) => <CategoryCard key={c.id} collection={c} count={counts.get(c.id)} />)
                : [0, 1, 2, 3, 4].map((i) => <li key={i} className={styles.categorySkeleton} />)}
              {ready ? (
                <li>
                  <Link href="/collections/all/" className={styles.category}>
                    <span className={cx(styles.categoryPicture, styles.categoryAll)}>
                      <span className={styles.allIcon}>
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <rect x="5" y="5" width="6" height="6" rx="1.5" />
                          <rect x="13" y="5" width="6" height="6" rx="1.5" />
                          <rect x="5" y="13" width="6" height="6" rx="1.5" />
                          <rect x="13" y="13" width="6" height="6" rx="1.5" />
                        </svg>
                      </span>
                    </span>
                    <span className={styles.categoryHead}>
                      <span className={styles.categoryName}>{t('home.categories.allTitle')}</span>
                      <ArrowRight className={styles.categoryArrow} />
                    </span>
                    <span className={styles.categoryCount}>{newest.status === 'ready' && newest.products.length ? t('home.categories.count', { count: newest.products.length }) : null}</span>
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </section>
      ) : null}

      <section className={styles.shop} id="shop">
        <div className={styles.wrap}>
          <div className={styles.centerHead}>
            <Eyebrow centered>{t('home.shop.eyebrow', { store: store.name })}</Eyebrow>
            <h2 className={styles.title}>{t('home.shop.title')}</h2>
            <p className={styles.subtitle}>{t('home.shop.lead')}</p>
          </div>
          <ProductShowcase collections={ready ? stocked : []} labels={labels} />
        </div>
      </section>

      {promoRich && promoFresh && promoRich.id !== promoFresh.id ? (
        <section className={styles.promos}>
          <h2 className={styles.hidden}>{t('home.promo.title')}</h2>
          <div className={cx(styles.wrap, styles.promoGrid)}>
            <PromoCard collection={promoRich} count={counts.get(promoRich.id)} tone="rich" />
            <PromoCard collection={promoFresh} count={counts.get(promoFresh.id)} tone="fresh" />
          </div>
        </section>
      ) : null}

      <section className={styles.story}>
        <div className={cx(styles.wrap, styles.storyGrid)}>
          <div className={styles.storyMedia}>
            <div className={styles.storyPicture}>
              <span className={styles.pictureMark} aria-hidden="true">
                <StoreLogo className={styles.markLogo} />
              </span>
              {storyProduct?.photo ? <Image image={storyProduct.photo} alt={storyProduct.photo.alt ?? storyProduct.name} ratio={0.8} sizes="(min-width: 1024px) 330px, 80vw" className={styles.fill} /> : null}
            </div>
            <div className={styles.storyBadge}>
              <StoreLogo className={styles.storyLogo} />
              <p className={styles.storyPlace}>
                <svg className={styles.pinIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" />
                  <circle cx="12" cy="10" r="2.3" />
                </svg>
                {t('home.story.place')}
              </p>
            </div>
          </div>
          <div className={styles.storyCopy}>
            <Eyebrow>{t('home.story.eyebrow')}</Eyebrow>
            <h2 className={styles.storyTitle}>{t('home.story.title')}</h2>
            <p className={styles.storyLead}>{t('home.story.lead', { store: store.name })}</p>
            <p className={styles.storyBody}>{t('home.story.body')}</p>
            {portfolio.length ? (
              <>
                <p className={styles.portfolio}>{t('home.story.portfolio')}</p>
                <ul className={styles.tags}>
                  {portfolio.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <div className={styles.storyActions}>
              <Link href="/about/" className={styles.solidButton}>
                {t('home.story.more')}
                <ArrowRight className={styles.buttonIcon} />
              </Link>
              <Link href="/collections/all/" className={styles.outlineButton}>
                {t('home.hero.explore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Reviews />

      <section className={styles.join}>
        <div className={styles.wrap}>
          <div className={styles.joinBanner}>
            <div className={styles.joinCopy}>
              <p className={styles.joinEyebrow}>{t('home.signup.eyebrow', { store: store.name })}</p>
              <h2 className={styles.joinTitle}>{t('home.signup.title')}</h2>
              <p className={styles.joinBody}>{t('home.signup.body')}</p>
            </div>
            <div className={styles.joinActions}>
              <Link href="/register/" className={styles.goldButton}>
                {t('home.signup.action')}
                <ArrowRight className={styles.buttonIcon} />
              </Link>
              <Link href="/sign-in/" className={styles.ghostButton}>
                {t('home.signup.signIn')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {faqs.length ? (
        <section className={styles.faq} id="faq">
          <div className={cx(styles.wrap, styles.faqGrid)}>
            <div className={styles.faqIntro}>
              <Eyebrow>{t('home.faq.eyebrow')}</Eyebrow>
              <h2 className={styles.title}>{t('faq.title')}</h2>
              <p className={styles.subtitle}>{t('home.faq.lead')}</p>
              <div className={styles.helpCard}>
                <h3 className={styles.helpTitle}>{t('faq.more.title')}</h3>
                <p className={styles.helpLead}>{t('home.faq.help')}</p>
                {contact.phone ? (
                  <Link href={contact.chat} className={styles.helpLine}>
                    <svg className={styles.helpIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d={chatPath} />
                    </svg>
                    <span className={styles.hidden}>{t('common.contact.whatsapp')}</span>
                    {contact.phone}
                  </Link>
                ) : null}
                {contact.email ? (
                  <Link href={t('common.contact.mailto', { email: contact.email })} className={styles.helpLine}>
                    <svg className={styles.helpIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                      <path d="M4 7l8 6 8-6" />
                    </svg>
                    {contact.email}
                  </Link>
                ) : null}
              </div>
            </div>
            <FaqAccordion items={faqs} />
          </div>
        </section>
      ) : null}
    </Layout>
  )
}
