// SSG server entry — renders the storefront to an HTML string at build time.
// Tries live GraphQL first (so cold rebuilds bake real product data into
// dist/index.html for SEO + instant first paint) and falls back to the
// bundled mock fixtures if the backend is unreachable / over-budget — same
// graceful-degradation policy as main.tsx.
import { renderStorefrontHTML } from '@tanqory/theme-kit/ssg'
import { createMockData, createLiveData, type DataApi } from '@tanqory/theme-kit'
import collections from './lib/collections.json'
import settings from './config/settings.json'
import locale from './locales/en.json'

const env = import.meta.env as ImportMetaEnv & {
  VITE_TANQORY_BACKEND?: string
  VITE_TANQORY_STORE_ID?: string
  VITE_TANQORY_STOREFRONT_TOKEN?: string
}

async function bootData(): Promise<DataApi> {
  const { VITE_TANQORY_BACKEND, VITE_TANQORY_STORE_ID, VITE_TANQORY_STOREFRONT_TOKEN } = env
  if (VITE_TANQORY_BACKEND && VITE_TANQORY_STORE_ID) {
    try {
      return await createLiveData({
        endpoint: VITE_TANQORY_BACKEND,
        storeId: VITE_TANQORY_STORE_ID,
        token: VITE_TANQORY_STOREFRONT_TOKEN,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[ssg] live data fetch failed, falling back to mocks:', (err as Error)?.message ?? err)
    }
  }
  return createMockData(collections)
}

export async function render(page = 'index'): Promise<string> {
  const data = await bootData()
  return renderStorefrontHTML({
    sections: import.meta.glob('./sections/*.tsx', { eager: true }),
    pages: import.meta.glob('./templates/*.json', { eager: true }),
    shell: import.meta.glob('./layouts/*.tsx', { eager: true }),
    data,
    settings,
    locale,
    page,
  })
}
