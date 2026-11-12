import { useId } from 'react'
import { useStorefront } from '@dripfunnel/storefront-core/theme'
import { Band, Closing, CompanyHero, Eyebrow, Heading, Values, companyStyles as styles, usePictured } from '../components/Company'
import { Layout } from '../components/Layout'

/** The vision or the mission: in the founders' own Hindi words, then in English. */
const Statement = ({ eyebrow, title, lead, hindi, english }: { eyebrow: string; title: string; lead?: string; hindi: string; english: string }) => {
  const { t } = useStorefront()
  const id = useId()
  return (
    <article className={styles.cardCream} aria-labelledby={id}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className={styles.cardTitle}>
        {title}
      </h2>
      {lead ? <p className={styles.text}>{lead}</p> : null}
      <p className={styles.quoteLabel}>{t('pages.vision.hindiLabel')}</p>
      <blockquote className={styles.quote}>{hindi}</blockquote>
      <p className={styles.quoteLabel}>{t('pages.vision.englishLabel')}</p>
      <p className={styles.english}>{english}</p>
    </article>
  )
}

export const VisionPage = () => {
  const { store, t } = useStorefront()
  const { pictured } = usePictured()
  return (
    <Layout>
      <CompanyHero
        eyebrow={t('pages.vision.eyebrow')}
        title={t('pages.vision.title')}
        tagline={t('pages.vision.tagline')}
        lead={t('pages.vision.lead', { store: store.name })}
        action={{ href: '/collections/all/', label: t('pages.vision.action') }}
        caption={t('pages.vision.caption')}
        product={pictured[0]}
      />
      <Band>
        <div className={styles.cards}>
          <Statement eyebrow={t('pages.vision.vision.eyebrow')} title={t('pages.vision.vision.title')} hindi={t('pages.vision.vision.hindi')} english={t('pages.vision.vision.english')} />
          <Statement
            eyebrow={t('pages.vision.mission.eyebrow')}
            title={t('pages.vision.mission.title')}
            lead={t('pages.vision.mission.lead')}
            hindi={t('pages.vision.mission.hindi')}
            english={t('pages.vision.mission.english')}
          />
        </div>
      </Band>
      <Band tone="cream">
        <Heading eyebrow={t('pages.vision.values.eyebrow')} title={t('pages.vision.values.title')} />
        <Values text={t('pages.vision.values.list')} />
      </Band>
      <Closing
        title={t('pages.vision.closingTitle', { store: store.name })}
        body={t('pages.vision.closingBody')}
        primary={{ href: '/collections/all/', label: t('pages.story.shop') }}
        secondary={{ href: '/our-story/', label: t('pages.company.readStory') }}
      />
    </Layout>
  )
}
