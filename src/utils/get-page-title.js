import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Sistema Base MPC'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
