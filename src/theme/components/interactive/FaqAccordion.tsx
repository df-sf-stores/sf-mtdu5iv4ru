'use client'

import { useState } from 'react'
import { Link } from '@dripfunnel/storefront-core/theme'
import type { FaqItem } from '../faqGroups'
import styles from '../../styles/landing.module.css'

const Arrow = () => (
  <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/** The questions as an accordion: one answer open at a time, the first open to begin with. */
export const FaqAccordion = ({ items }: { items: FaqItem[] }) => {
  const [open, setOpen] = useState(0)
  return (
    <div className={styles.faqList}>
      {items.map((item, index) => (
        <div key={item.question} className={index === open ? styles.faqItemOpen : styles.faqItem}>
          <h3 className={styles.faqHeading}>
            <button type="button" className={styles.faqQuestion} aria-expanded={index === open} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(index === open ? -1 : index)}>
              {item.question}
              <span className={styles.faqIcon} aria-hidden="true" />
            </button>
          </h3>
          <div id={`faq-answer-${index}`} className={styles.faqAnswer} hidden={index !== open}>
            {item.answer.map((line) => (
              <p key={line} className={styles.faqLine}>
                {line}
              </p>
            ))}
            {item.link ? (
              <Link href={item.link.href} className={styles.faqLink}>
                {item.link.label}
                <Arrow />
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}
