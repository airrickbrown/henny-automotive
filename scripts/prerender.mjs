import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir   = path.resolve(__dirname, '..')
const distDir   = path.join(rootDir, 'dist')
const ssrDir    = path.join(rootDir, 'dist-ssr')

// React 19 renderToString hoists <title>, <meta>, and <link> to the very
// beginning of the output string. Extract them so they land in <head>.
function extractHeadTags(html) {
  const tags = []
  let rest = html

  // Match one metadata tag at a time from the start of the string
  const TAG_RE = /^<(title|meta|link)(\s[^>]*)?(>[\s\S]*?<\/title>|\/?>)/i
  while (true) {
    const m = rest.match(TAG_RE)
    if (!m) break
    tags.push(m[0])
    rest = rest.slice(m[0].length)
  }

  return {
    headTags: tags.join('\n    '),
    bodyHtml: rest,
  }
}

async function main() {
  // Load the SSR bundle produced by `vite build --ssr`
  const ssrEntry = path.join(ssrDir, 'entry-server.js')
  const { render, prerenderRoutes } = await import(pathToFileURL(ssrEntry).href)

  // Read the client-side HTML shell produced by `vite build`
  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

  console.log(`\nPrerendering ${prerenderRoutes.length} routes...\n`)

  for (const url of prerenderRoutes) {
    let appHtml = ''
    let headTags = ''

    try {
      const { appHtml: raw } = render(url)
      const extracted = extractHeadTags(raw)
      headTags = extracted.headTags
      appHtml  = extracted.bodyHtml
    } catch (err) {
      console.warn(`  ⚠  SSR error for ${url}:`, err.message)
    }

    // Inject head tags + app HTML into the shell
    const html = template
      .replace('</head>', `    ${headTags}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

    // Write to dist — nested dirs for non-root routes
    const outputPath =
      url === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, url.slice(1), 'index.html')

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, html, 'utf-8')
    console.log(`  ✓  ${url}`)
  }

  // Clean up SSR bundle — not needed at runtime
  fs.rmSync(ssrDir, { recursive: true, force: true })

  console.log('\nPrerender complete.\n')
}

main().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
