import { useStorefront } from '@dripfunnel/storefront-core/theme'

/**
 * How to reach the shop: the store's own settings first, then the details written in `content/en/common.json`
 * (`common.contact`), so the header, footer, FAQ and contact page all show the same phone, email and address.
 */
export const useContact = () => {
  const { store, t } = useStorefront()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const own = [store.address?.street, [store.address?.city, store.address?.region].filter(Boolean).join(' '), store.address?.postal].filter((line): line is string => Boolean(line))
  const written = t('common.contact.address')
    .split('|')
    .map((line) => line.trim())
    .filter(Boolean)
  return {
    legalName: store.name,
    phone: store.contactPhone || t('common.contact.phone'),
    email: store.contactEmail || t('common.contact.email'),
    chat: whatsapp?.url ?? t('common.contact.chat'),
    address: own.length ? own : written,
    taxId: t('common.contact.gstin'),
    social: store.social.filter((s) => s.network !== 'whatsapp'),
  }
}
