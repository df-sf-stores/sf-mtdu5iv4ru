import type { ReactNode } from 'react'
import { ConsentBanner, Link, MerchantImage, navigate, PoweredBy, PreviewBanner, SearchField, StoreLogo, useCart, useCollections, useMenu, useStorefront, useWishlist } from '@dripfunnel/storefront-core/theme'
import { CategoryIcon, iconFor } from './CategoryIcon'
import { useContact } from './contact'
import { AccountMenu } from './interactive/AccountMenu'
import { Menu } from './interactive/Menu'
import { NavItem } from './interactive/NavItem'
import styles from '../styles/layout.module.css'

// The theme rules allow no URL encoding, so the characters that would break the query are dropped instead.
// The DripFunnel logo is a Storefront › Assets picture named by its media id in content ("none" until it is uploaded),
// shown at its file's 845 × 143 ratio; until then the footer writes the name instead.
const mediaId = /^[A-Za-z0-9_-]{1,128}$/
const hasLogo = (id: string) => id !== 'none' && mediaId.test(id)
const poweredLogoRatio = 845 / 143

const searchFor = (words: string) => navigate(`/search/?q=${words.replace(/[&+%#]/g, ' ').trim()}`)

const Glyph = ({ className, children }: { className: string | undefined; children: ReactNode }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

export const chatPath = 'M12 3.5a8.5 8.5 0 00-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1012 3.5z'
const pinPath = 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z'

const SocialGlyph = ({ network }: { network: string }) => {
  if (network === 'facebook') return <path d="M14 8h2V4.5h-2.5C10.6 4.5 9.5 6.3 9.5 9v2H7.5v3.5h2V21H13v-6.5h2.4l.6-3.5h-3V9.3c0-.8.3-1.3 1-1.3z" />
  if (network === 'instagram')
    return (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17" cy="7" r="0.6" />
      </>
    )
  if (network === 'youtube')
    return (
      <>
        <rect x="3" y="6" width="18" height="12" rx="3.5" />
        <path d="M10.5 9.5v5l4-2.5z" />
      </>
    )
  if (network === 'whatsapp') return <path d={chatPath} />
  return (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" />
    </>
  )
}

export const Layout = ({ children }: { children: ReactNode }) => {
  const { store, t, mode, poweredBy } = useStorefront()
  const poweredLogo = t('common.footer.poweredLogo')
  const menu = useMenu()
  // `first: 20` matches the home page's request, so both share one answer.
  const { collections: fetched, status } = useCollections({ first: 20 })
  const collections = status === 'ready' ? fetched : []
  const { count } = useCart()
  const { count: wished } = useWishlist()
  const contact = useContact()
  return (
    <div className={styles.shell}>
      {mode === 'live' ? null : <PreviewBanner t={t} className={styles.preview} />}
      <div className={styles.topbar}>
        <div className={styles.topInner}>
          <nav className={styles.topLinks} aria-label={t('common.nav.company')}>
            <Link href="/about/" className={styles.topLink}>
              {t('common.nav.aboutUs')}
            </Link>
            <Link href="/contact/" className={styles.topLink}>
              {t('common.nav.contactUs')}
            </Link>
          </nav>
          <p className={styles.topNote}>
            <span>{t('common.top.promise', { store: store.name })}</span>
            <span className={styles.topDot} aria-hidden="true" />
            <span className={styles.topSecond}>{t('common.top.secure')}</span>
          </p>
          <div className={`${styles.topLinks} ${styles.topEnd}`}>
            <Link href="/account/orders/" className={styles.topLink}>
              {t('common.top.track')}
            </Link>
            <Link href="/#faq" className={styles.topLink}>
              {t('common.top.help')}
            </Link>
            {contact.phone ? (
              <Link href={contact.chat} className={styles.topPhone}>
                <Glyph className={styles.topIcon}>
                  <path d={chatPath} />
                </Glyph>
                <span className={styles.hidden}>{t('common.contact.whatsapp')}</span>
                {contact.phone}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      <header className={styles.header}>
        <div className={styles.bar}>
          <div className={styles.menuSlot}>
            <Menu label={t('common.nav.menu')}>
              <nav className={styles.nav} aria-label={t('common.nav.label')}>
                <Link href="/" className={styles.navLink}>
                  {t('common.nav.home')}
                </Link>
                <Link href="/collections/all/" className={styles.navLink}>
                  {t('common.nav.shopAll')}
                </Link>
                {menu.items.map((item) => (
                  <NavItem key={item.id} item={item} />
                ))}
                <Link href="/about/" className={styles.navLink}>
                  {t('common.nav.aboutUs')}
                </Link>
                <Link href="/our-story/" className={styles.navLink}>
                  {t('common.nav.story')}
                </Link>
                <Link href="/vision-mission/" className={styles.navLink}>
                  {t('common.nav.vision')}
                </Link>
                <Link href="/contact/" className={styles.navLink}>
                  {t('common.nav.contactUs')}
                </Link>
                <Link href="/account/orders/" className={styles.navLink}>
                  {t('common.top.track')}
                </Link>
                <Link href="/#faq" className={styles.navLink}>
                  {t('common.top.help')}
                </Link>
              </nav>
            </Menu>
          </div>
          <Link href="/" className={styles.brand}>
            <StoreLogo className={styles.logo} />
          </Link>
          <SearchField label={t('common.tools.search')} placeholder={t('common.tools.searchPrompt')} button={t('common.tools.search')} value="" onSearch={searchFor} suggest={4} className={styles.search} />
          <div className={styles.tools}>
            <span className={styles.language}>
              <Glyph className={styles.languageIcon}>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" />
              </Glyph>
              {t('common.tools.language')}
            </span>
            <Link href="/account/wishlist/" className={`${styles.tool} ${styles.wishTool}`}>
              <Glyph className={styles.icon}>
                <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" />
              </Glyph>
              <span className={styles.hidden}>{wished > 0 ? t('common.tools.wishlistCount', { count: wished }) : t('common.tools.wishlist')}</span>
              {wished > 0 ? (
                <span className={styles.count} aria-hidden="true">
                  {wished}
                </span>
              ) : null}
            </Link>
            <Link href="/cart/" className={styles.tool}>
              <Glyph className={styles.icon}>
                <path d="M3 4h2.5l2.2 11h10.6l2-8H7" />
                <circle cx="9.5" cy="19" r="1.4" />
                <circle cx="17" cy="19" r="1.4" />
              </Glyph>
              <span className={styles.hidden}>{count > 0 ? t('common.tools.cartCount', { count }) : t('common.tools.cart')}</span>
              {count > 0 ? (
                <span className={styles.count} aria-hidden="true">
                  {count}
                </span>
              ) : null}
            </Link>
            <AccountMenu />
          </div>
        </div>
      </header>
      <nav className={styles.catNav} aria-label={t('common.nav.categories')}>
        <ul className={styles.catList}>
          <li className={styles.catItem}>
            <Link href="/collections/all/" className={`${styles.catLink} ${styles.catAll}`}>
              <CategoryIcon kind="all" className={styles.catSvg} />
              <span className={styles.catName}>{t('common.nav.shopAll')}</span>
            </Link>
          </li>
          {collections.map((c) => (
            <li key={c.id} className={styles.catItem}>
              <Link href={c.href} className={styles.catLink}>
                <CategoryIcon kind={iconFor(c.name)} className={styles.catSvg} />
                <span className={styles.catName}>{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.columns}>
          <div className={styles.about}>
            <Link href="/" className={styles.footerBrand}>
              <StoreLogo className={styles.footerLogo} />
            </Link>
            <p className={styles.tagline}>{t('common.top.promise', { store: store.name })}</p>
            <p className={styles.note}>{store.description || t('common.footer.note')}</p>
            {contact.social.length ? (
              <div className={styles.social}>
                {contact.social.map((s) => (
                  <Link key={s.network} href={s.url} className={styles.socialLink}>
                    <Glyph className={styles.socialIcon}>
                      <SocialGlyph network={s.network} />
                    </Glyph>
                    <span className={styles.hidden}>{s.network}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <nav className={styles.links} aria-label={t('common.footer.shop')}>
            <h2 className={styles.heading}>{t('common.footer.shop')}</h2>
            {collections.length ? (
              collections.map((c) => (
                <Link key={c.id} href={c.href} className={styles.footerLink}>
                  {c.name}
                </Link>
              ))
            ) : (
              <Link href="/collections/all/" className={styles.footerLink}>
                {t('common.footer.all')}
              </Link>
            )}
          </nav>
          <nav className={styles.links} aria-label={t('common.footer.customer')}>
            <h2 className={styles.heading}>{t('common.footer.customer')}</h2>
            <Link href="/collections/all/" className={styles.footerLink}>
              {t('common.footer.all')}
            </Link>
            <Link href="/account/orders/" className={styles.footerLink}>
              {t('common.footer.orders')}
            </Link>
            <Link href="/account/" className={styles.footerLink}>
              {t('common.footer.myAccount')}
            </Link>
            <Link href="/contact/" className={styles.footerLink}>
              {t('common.nav.contactUs')}
            </Link>
            <Link href="/privacy-policy/" className={styles.footerLink}>
              {t('common.footer.privacy')}
            </Link>
            <Link href="/terms-and-conditions/" className={styles.footerLink}>
              {t('common.footer.terms')}
            </Link>
          </nav>
          <nav className={styles.links} aria-label={t('common.footer.company')}>
            <h2 className={styles.heading}>{t('common.footer.company')}</h2>
            <Link href="/about/" className={styles.footerLink}>
              {t('common.nav.aboutUs')}
            </Link>
            <Link href="/our-story/" className={styles.footerLink}>
              {t('common.nav.story')}
            </Link>
            <Link href="/vision-mission/" className={styles.footerLink}>
              {t('common.nav.vision')}
            </Link>
            <Link href="/contact/" className={styles.footerLink}>
              {t('common.nav.contact')}
            </Link>
          </nav>
          <div className={styles.links}>
            <h2 className={styles.heading}>{t('common.footer.touch')}</h2>
            {contact.address.length ? (
              <div className={styles.contact}>
                <Glyph className={styles.contactIcon}>
                  <path d={pinPath} />
                  <circle cx="12" cy="10" r="2.3" />
                </Glyph>
                <p className={styles.address}>
                  <span className={styles.addressName}>{contact.legalName}</span>
                  {contact.address.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </div>
            ) : null}
            {contact.email ? (
              <Link href={t('common.contact.mailto', { email: contact.email })} className={`${styles.contact} ${styles.contactLink}`}>
                <Glyph className={styles.contactIcon}>
                  <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                  <path d="M4 7l8 6 8-6" />
                </Glyph>
                {contact.email}
              </Link>
            ) : null}
            {contact.phone ? (
              <Link href={contact.chat} className={`${styles.contact} ${styles.contactLink}`}>
                <Glyph className={styles.contactIcon}>
                  <path d={chatPath} />
                </Glyph>
                <span className={styles.hidden}>{t('common.contact.whatsapp')}</span>
                {contact.phone}
              </Link>
            ) : null}
            {contact.taxId ? <p className={styles.taxId}>{t('common.contact.taxId', { id: contact.taxId })}</p> : null}
          </div>
        </div>
        <ul className={styles.perks}>
          <li className={styles.perk}>
            <Glyph className={styles.contactIcon}>
              <rect x="5" y="10.5" width="14" height="10" rx="2" />
              <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" />
            </Glyph>
            {t('common.footer.perks.secure')}
          </li>
          <li className={styles.perk}>
            <Glyph className={styles.contactIcon}>
              <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
              <path d="M9 12l2 2 4-4" />
            </Glyph>
            {t('common.footer.perks.quality')}
          </li>
          <li className={styles.perk}>
            <Glyph className={styles.contactIcon}>
              <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M6.3 17.7l2.8-2.8M14.9 9.1l2.8-2.8" />
            </Glyph>
            {t('common.footer.perks.selected')}
          </li>
          <li className={styles.perk}>
            <Glyph className={styles.contactIcon}>
              <path d="M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2z" />
            </Glyph>
            {t('common.footer.perks.support')}
          </li>
        </ul>
        <div className={styles.base}>
          <p className={styles.copyright}>{t('common.footer.rights', { store: contact.legalName })}</p>
          <div className={styles.poweredGroup}>
            {poweredBy ? <PoweredBy brand={poweredBy} t={t} className={styles.powered} /> : <span className={styles.poweredLabel}>{t('common.footer.poweredBy')}</span>}
            <Link href={t('common.footer.poweredUrl')} className={styles.poweredLink}>
              {hasLogo(poweredLogo) ? (
                <MerchantImage asset={poweredLogo} alt={t('common.footer.poweredAlt')} ratio={poweredLogoRatio} sizes="120px" className={styles.poweredLogo} />
              ) : (
                <span className={styles.poweredName}>{t('common.footer.poweredAlt')}</span>
              )}
            </Link>
          </div>
        </div>
      </footer>
      {contact.phone ? (
        <Link href={contact.chat} className={styles.whatsapp}>
          <svg className={styles.whatsappIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zm4.4 12.4c-.2.5-1.1 1-1.6 1-.4.1-.9.1-1.5-.1a13 13 0 01-1.4-.5 10.6 10.6 0 01-4-3.6 4.6 4.6 0 01-1-2.4c0-1.2.6-1.7.8-2 .2-.2.5-.3.6-.3h.5c.1 0 .4 0 .6.4l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z" />
          </svg>
          <span className={styles.hidden}>{t('common.footer.whatsapp')}</span>
        </Link>
      ) : null}
      <ConsentBanner t={t} className={styles.consent} />
    </div>
  )
}
