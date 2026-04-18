import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
export { prerenderRoutes } from './prerender-routes'

export function render(url: string): { appHtml: string } {
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
  return { appHtml }
}
