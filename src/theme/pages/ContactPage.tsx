import { Link, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Band, Eyebrow, Facts, NextPage, companyStyles as styles } from '../components/Company'
import { useContact } from '../components/contact'
import { Layout, chatPath } from '../components/Layout'

export const ContactPage = () => {
  const { store, t } = useStorefront()
  const contact = useContact()
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.wrap}>
          <div className={styles.heroCopy}>
            <Eyebrow>{t('common.nav.contactUs')}</Eyebrow>
            <h1 className={styles.heroTitle}>{t('pages.contact.title')}</h1>
            <p className={styles.heroLead}>{t('pages.contact.lead')}</p>
            {contact.phone ? (
              <Link href={contact.chat} className={styles.solidButton}>
                {t('pages.contact.chat')}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
      <Band>
        <div className={styles.split}>
          <div className={styles.splitCopy}>
            <Eyebrow>{t('pages.about.visit.title')}</Eyebrow>
            <h2 className={styles.title}>{store.name}</h2>
            {contact.address.length ? <p className={styles.text}>{contact.address.join(', ')}</p> : null}
            {contact.taxId ? <p className={styles.textMuted}>{t('common.contact.taxId', { id: contact.taxId })}</p> : null}
          </div>
          <Facts
            items={[
              ...(contact.phone
                ? [
                    {
                      label: t('pages.contact.phone'),
                      value: contact.phone,
                      icon: <path d={chatPath} />,
                    },
                  ]
                : []),
              ...(contact.email
                ? [
                    {
                      label: t('pages.contact.email'),
                      value: contact.email,
                      icon: (
                        <>
                          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                          <path d="M4 7l8 6 8-6" />
                        </>
                      ),
                    },
                  ]
                : []),
              ...(contact.address.length
                ? [
                    {
                      label: t('pages.contact.visit'),
                      value: contact.address.join(', '),
                      icon: (
                        <>
                          <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" />
                          <circle cx="12" cy="10" r="2.3" />
                        </>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </Band>
      <NextPage title={t('faq.more.title')} body={t('home.faq.lead')} action={{ href: '/help/', label: t('common.footer.faq') }} />
    </Layout>
  )
}
