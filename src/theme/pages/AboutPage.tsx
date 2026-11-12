import { Link, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Band, Closing, CompanyHero, Eyebrow, Facts, Heading, NextPage, Range, Split, Values, companyStyles as styles, listOf, usePictured } from '../components/Company'
import { Layout } from '../components/Layout'

export const AboutPage = () => {
  const { store, t } = useStorefront()
  const { pictured, count, ready } = usePictured()
  return (
    <Layout>
      <CompanyHero
        eyebrow={t('pages.about.eyebrow', { store: store.name })}
        title={t('pages.about.title')}
        lead={t('pages.about.lead', { store: store.name })}
        chips={listOf(t('pages.about.chips'))}
        action={{ href: '/our-story/', label: t('pages.about.action') }}
        caption={t('pages.about.caption')}
        product={pictured[0]}
      />
      <Band>
        <Split products={pictured}>
          <Eyebrow>{t('pages.about.company.eyebrow')}</Eyebrow>
          <h2 className={styles.title}>
            {t('pages.about.company.title')}
          </h2>
          <p className={styles.text}>{t('pages.about.company.first', { store: store.name })}</p>
          <p className={styles.textMuted}>{t('pages.about.company.second')}</p>
          <Facts
            items={[
              {
                label: t('pages.about.company.hq'),
                value: t('pages.about.company.hqValue'),
                icon: (
                  <>
                    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" />
                    <circle cx="12" cy="10" r="2.3" />
                  </>
                ),
              },
              { label: t('pages.about.company.work'), value: t('pages.about.company.workValue'), icon: <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /> },
              { label: t('pages.about.company.markets'), value: t('pages.about.company.marketsValue'), icon: <path d="M4 10h16M5 10l1-5h12l1 5M5 10v10h14V10M9 20v-5h6v5" /> },
              ...(ready && count ? [{ label: t('pages.about.company.online'), value: t('pages.about.company.onlineValue', { count }), icon: <path d="M5 8h14l-1 12H6zM9 8V6.5a3 3 0 016 0V8" /> }] : []),
            ]}
          />
        </Split>
      </Band>
      <Band tone="cream">
        <Heading eyebrow={t('pages.company.rangeEyebrow')} title={t('pages.company.rangeTitle')} lead={t('pages.company.rangeLead')} centered />
        <Range text={t('pages.company.range')} products={pictured} />
        <div className={styles.center}>
          <Link href="/collections/all/" className={styles.outlineButton}>
            {t('pages.company.explore')}
          </Link>
        </div>
      </Band>
      <Band>
        <Heading eyebrow={t('pages.about.commitment.eyebrow')} title={t('pages.about.commitment.title')} lead={t('pages.about.commitment.lead', { store: store.name })} />
        <Values text={t('pages.about.commitment.values')} />
      </Band>
      <Closing
        title={t('pages.company.closingTitle')}
        body={t('pages.company.closingBody')}
        primary={{ href: '/collections/all/', label: t('pages.company.explore') }}
        secondary={{ href: '/our-story/', label: t('pages.company.readStory') }}
      />
      <NextPage title={t('pages.company.guidesTitle')} body={t('pages.company.guidesBody', { store: store.name })} action={{ href: '/vision-mission/', label: t('pages.company.vision') }} />
    </Layout>
  )
}
