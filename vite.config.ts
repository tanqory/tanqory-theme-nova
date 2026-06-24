import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Editor persistence — the editor's "Save" POSTs the content tree here.
//   DOKS  (CODE_URL + THEME_ID set): PUT to the writable code store (PVC) so the
//          edit survives the scale-to-zero pod and the next fetch picks it up.
//   local (neither set): write templates/<page>.json on disk.
function studioSave(): Plugin {
  return {
    name: 'studio-save',
    configureServer(server) {
      server.middlewares.use('/__studio/save', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; return res.end() }
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', async () => {
          try {
            const { page = 'index', doc } = JSON.parse(body)
            // theme-kit template format is { sections: [...] }
            const content = JSON.stringify(Array.isArray(doc) ? { sections: doc } : doc, null, 2) + '\n'
            const codeUrl = process.env.CODE_URL
            const themeId = process.env.THEME_ID
            if (codeUrl && themeId) {
              const r = await fetch(`${codeUrl}/api/themes/${themeId}/file?path=templates/${page}.json`, { method: 'PUT', body: content })
              if (!r.ok) throw new Error(`code-store PUT ${r.status}`)
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ ok: true, persisted: 'code-store', themeId, page }))
            } else {
              writeFileSync(join(process.cwd(), 'templates', `${page}.json`), content)
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ ok: true, file: `templates/${page}.json` }))
            }
          } catch (e) {
            res.statusCode = 400
            res.end(JSON.stringify({ ok: false, error: String(e) }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), studioSave()],
  server: {
    port: 4321,
    // Accept any ingress host (e.g. <slug>.mytanqory.com).
    allowedHosts: true,
    // HMR is disabled in the sandbox: the storefront runs behind the studio
    // router + Knative ingress, where vite's HMR WebSocket can't reach the pod
    // (browser tried wss://localhost:8080 and wss://<slug>.mytanqory.com → fail,
    // noisy console error). We don't need HMR here — live edits reach the canvas
    // via the editor's postMessage PreviewBridge, and saved edits apply on the
    // next pod start (Publish → code store → re-fetch). If STUDIO_PROXY_PORT is
    // set (local proxy dev), use it so HMR still works there.
    hmr: process.env.STUDIO_PROXY_PORT
      ? { clientPort: Number(process.env.STUDIO_PROXY_PORT) }
      : false,
  },
  // Production serve plane: `vite preview` serves the built static site (no dev
  // server, no HMR client). It enforces its own host allow-list, so accept any
  // <slug>.mytanqory.com host here.
  preview: {
    allowedHosts: true,
  },
})
