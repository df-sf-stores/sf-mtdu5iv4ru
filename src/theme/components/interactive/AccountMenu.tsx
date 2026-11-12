'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link, useAccount, useStorefront } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/layout.module.css'

/**
 * The header's account control. It reads the session the account pages read (core's useAccount: the shopper's
 * session token and their account), so the two always agree. Signed out, it is the Sign in button; signed in, the
 * shopper's first name opens a list of account links and Sign out.
 *
 * The session lives only in the browser, so the server and the first render can't know it. Until the page has
 * mounted and the account has answered, the control holds its place empty rather than show a state that may be
 * wrong. A new sign-in during this visit asks for the account afresh, so the header names whoever signed in.
 */
export const AccountMenu = () => {
  const { t } = useStorefront()
  const page = useAccount()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const was = useRef(page.status)
  const first = useRef<HTMLAnchorElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const id = useId()

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (was.current === 'signedOut' && page.status !== 'signedOut') page.retry()
    if (page.status === 'signedOut') setOpen(false)
    was.current = page.status
  }, [page.status])
  useEffect(() => {
    if (open) first.current?.focus()
  }, [open])

  const status = mounted ? page.status : 'loading'

  if (status === 'loading') return <span className={styles.accountHold} aria-hidden="true" />

  if (status === 'signedOut')
    return (
      <Link href="/account/" className={styles.signIn}>
        {t('common.tools.signIn')}
      </Link>
    )

  const full = page.account?.name?.trim() ?? ''
  const name = full.split(/\s+/)[0] || t('common.tools.account')
  const close = () => setOpen(false)
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) {
      event.stopPropagation()
      close()
      button.current?.focus()
    }
  }
  const signOut = async () => {
    setLeaving(true)
    await page.signOut()
    setLeaving(false)
    close()
  }

  return (
    <div className={styles.account} onKeyDown={onKey}>
      <button ref={button} type="button" className={open ? styles.accountButtonOpen : styles.accountButton} aria-expanded={open} aria-controls={id} aria-label={t('common.accountMenu.label', { name: full || name })} onClick={() => setOpen(!open)}>
        <svg className={styles.accountIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="8.5" r="3.8" />
          <path d="M4.5 20c1.2-3.9 4.1-5.8 7.5-5.8s6.3 1.9 7.5 5.8" />
        </svg>
        <span className={styles.accountName}>{name}</span>
        <svg className={styles.accountChevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? <button type="button" className={styles.accountBackdrop} tabIndex={-1} aria-hidden="true" onClick={close} /> : null}
      <div id={id} className={styles.accountPanel} hidden={!open}>
        <ul className={styles.accountList} onClick={close}>
          <li>
            <Link ref={first} href="/account/" className={styles.accountLink}>
              {t('common.accountMenu.myAccount')}
            </Link>
          </li>
          <li>
            <Link href="/account/orders/" className={styles.accountLink}>
              {t('common.accountMenu.orders')}
            </Link>
          </li>
          <li>
            <Link href="/account/addresses/" className={styles.accountLink}>
              {t('common.accountMenu.addresses')}
            </Link>
          </li>
          <li>
            <Link href="/account/wishlist/" className={styles.accountLink}>
              {t('common.accountMenu.wishlist')}
            </Link>
          </li>
        </ul>
        <button type="button" className={styles.accountSignOut} disabled={leaving} onClick={signOut}>
          {leaving ? t('common.accountMenu.signingOut') : t('common.accountMenu.signOut')}
        </button>
      </div>
    </div>
  )
}
