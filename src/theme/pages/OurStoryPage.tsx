import { useStorefront } from '@dripfunnel/storefront-core/theme'
import { Band, Closing, CompanyHero, Eyebrow, Facts, Heading, NextPage, Range, Split, Values, companyStyles as styles, usePictured } from '../components/Company'
import { Layout } from '../components/Layout'

const Person = ({ name, role }: { name: string; role: string }) => (
  <li className={styles.card}>
    <div className={styles.person}>
      <span className={styles.avatar} aria-hidden="true">
        {name.slice(0, 1)}
      </span>
      <div>
        <p className={styles.personName}>{name}</p>
        <p className={styles.personRole}>{role}</p>
      </div>
    </div>
  </li>
)

export const OurStoryPage = () => {
  const { store, t } = useStorefront()
  const { pictured } = usePictured()
  return (
    <Layout>
      <CompanyHero
        eyebrow={t('pages.story.eyebrow', { store: store.name })}
        title={t('pages.story.title')}
        tagline={t('pages.story.tagline', { store: store.name })}
        lead={t('pages.story.lead', { store: store.name })}
        action={{ href: '/collections/all/', label: t('pages.story.action') }}
        caption={t('pages.story.caption')}
        product={pictured[0]}
      />
      <Band>
        <Split products={pictured}>
          <Eyebrow>{t('pages.story.beginning.eyebrow')}</Eyebrow>
          <h2 className={styles.title}>
            {t('pages.story.beginning.title')}
          </h2>
          <p className={styles.text}>{t('pages.story.beginning.body', { store: store.name })}</p>
          <Facts items={[{ label: t('pages.story.founded'), value: t('pages.story.foundedValue'), icon: <path d="M5 5h14v15H5zM5 9h14M9 3v4M15 3v4" /> }]} />
          <p className={styles.quoteLabel}>{t('pages.story.beginning.founders')}</p>
          <ul className={styles.cards}>
            <Person name={t('pages.story.beginning.first')} role={t('pages.story.beginning.role')} />
            <Person name={t('pages.story.beginning.second')} role={t('pages.story.beginning.role')} />
          </ul>
        </Split>
      </Band>
      <Band tone="cream">
        <Heading eyebrow={t('pages.story.meaning.eyebrow')} title={t('pages.story.meaning.title')} lead={t('pages.story.meaning.lead')} centered />
        <ul className={styles.nameSum}>
          <li className={styles.nameCard}>
            <p className={styles.nameWord}>{t('pages.story.meaning.manu')}</p>
            <p className={styles.nameOf}>{t('pages.story.meaning.manuOf')}</p>
            <p className={styles.nameWords}>{t('pages.story.meaning.manuWords')}</p>
          </li>
          <li className={styles.sign} aria-hidden="true">
            {t('pages.story.meaning.plus')}
          </li>
          <li className={styles.nameCard}>
            <p className={styles.nameWord}>{t('pages.story.meaning.yogi')}</p>
            <p className={styles.nameOf}>{t('pages.story.meaning.yogiOf')}</p>
            <p className={styles.nameWords}>{t('pages.story.meaning.yogiWords')}</p>
          </li>
          <li className={styles.sign} aria-hidden="true">
            {t('pages.story.meaning.equals')}
          </li>
          <li className={styles.nameCardResult}>
            <p className={styles.nameWord}>{t('pages.story.meaning.name')}</p>
            <p className={styles.nameOf}>{t('pages.story.meaning.nameOf')}</p>
            <p className={styles.nameWords}>{t('pages.story.meaning.nameWords')}</p>
          </li>
        </ul>
      </Band>
      <Band>
        <Heading eyebrow={t('pages.story.family.eyebrow')} title={t('pages.story.family.title')} lead={t('pages.story.family.lead')} centered />
        <Range text={t('pages.company.range')} products={pictured} />
      </Band>
      <Band tone="cream">
        <Heading eyebrow={t('pages.story.values.eyebrow')} title={t('pages.story.values.title')} />
        <Values text={t('pages.story.values.list')} />
      </Band>
      <Closing
        title={t('pages.story.closingTitle')}
        body={t('pages.story.closingBody', { store: store.name })}
        primary={{ href: '/collections/all/', label: t('pages.story.shop') }}
        secondary={{ href: '/about/', label: t('pages.story.about', { store: store.name }) }}
      />
      <NextPage title={t('pages.company.guidesTitle')} body={t('pages.company.guidesBody', { store: store.name })} action={{ href: '/vision-mission/', label: t('pages.company.vision') }} />
    </Layout>
  )
}
