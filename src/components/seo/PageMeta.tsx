// React 19 natively hoists <title>, <meta>, and <link> to <head>
// from anywhere in the component tree — no library needed.

interface PageMetaProps {
  title: string
  description: string
  image?: string
  path?: string
  type?: 'website' | 'article'
}

const SITE_NAME = 'Henny Automotive'
const SITE_URL  = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://hennyautomotive.com'

export default function PageMeta({
  title,
  description,
  image = '/images/hero-car.jpg',
  path = '',
  type = 'website',
}: PageMetaProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const ogImage   = `${SITE_URL}${image}`
  const canonical = `${SITE_URL}${path}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:url"         content={canonical} />

      {/* Twitter / X */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />
    </>
  )
}
