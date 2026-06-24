import { useEffect, useState } from 'react'
import { defineSection, useData, type SectionProps } from '@tanqory/theme-kit'
import { apiBase } from '../lib/api-base'
import { ImageResponsive } from '../components/ImageResponsive'
import { Money } from '../components/Money'
import { Link } from '../components/Link'

interface ProductCard {
  handle: string
  title: string
  featuredImage: { url: string; altText?: string } | null
  price: { amount: string; currencyCode: string }
}

/**
 * Featured collection — a curated row of products. Headline + product cards.
 *
 * Prefer the bootstrap-prefetched cache (`collectionByHandle`) so the first
 * paint has product cards baked into the SSG HTML. When the merchant picks
 * a collection that wasn't in the prefetch window (e.g. catalogue > 10
 * collections, or the editor changed the handle live), fetch the specific
 * collection over GraphQL and re-render — slower, but means every collection
 * the admin lists is renderable, not just the first batch.
 */
export function FeaturedCollection({ attributes }: SectionProps): JSX.Element {
  const { collectionByHandle } = useData()
  const handle = (attributes.collection as string) ?? 'all'
  const limit = (attributes.limit as number) ?? 8
  const eyebrow = attributes.eyebrow as string | undefined
  const heading = (attributes.heading as string) ?? 'Featured'
  const subheading = attributes.subheading as string | undefined
  const showViewAll = attributes.showViewAll !== false

  const cached = collectionByHandle(handle)
  const cachedProducts = (cached?.products ?? []).slice(0, limit)
  const [livePrducts, setLiveProducts] = useState<ProductCard[] | null>(null)

  // Trust the bootstrap cache only when it actually has products for this
  // handle. The cache is baked at BUILD time — a collection whose products
  // were assigned (or made storefront-visible) after the last build sits in
  // the cache as an empty shell, and short-circuiting on the bare cache hit
  // rendered "No products yet" while the live API had the products. Cache
  // hit WITH products = instant paint; empty/missing = live-fetch refresh.
  const cacheUsable = Boolean(cached && cachedProducts.length > 0)

  // Live-fetch fallback: fires when the bootstrap cache can't serve this
  // handle (absent OR empty). Keeps the editor-switch UX correct even for
  // collections created/filled after the theme's last build.
  useEffect(() => {
    if (cacheUsable) {
      setLiveProducts(null)
      return
    }
    const env = import.meta.env as ImportMetaEnv & {
      VITE_TANQORY_BACKEND?: string
      VITE_TANQORY_STORE_ID?: string
      VITE_TANQORY_STOREFRONT_TOKEN?: string
    }
    if (!env.VITE_TANQORY_BACKEND || !env.VITE_TANQORY_STORE_ID) return
    const url = `${apiBase(env.VITE_TANQORY_BACKEND)}/api/v1/stores/${encodeURIComponent(
      env.VITE_TANQORY_STORE_ID,
    )}/graphql`
    let cancelled = false
    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(env.VITE_TANQORY_STOREFRONT_TOKEN
          ? { 'x-publishable-key': env.VITE_TANQORY_STOREFRONT_TOKEN }
          : {}),
      },
      body: JSON.stringify({
        query: `query C($h: String, $first: Int!) {
          collection(handle: $h) {
            handle
            title
            products(first: $first) {
              edges {
                node {
                  handle
                  title
                  featuredImage { url altText }
                  priceRange { minVariantPrice { amount currencyCode } }
                }
              }
            }
          }
        }`,
        variables: { h: handle, first: limit },
      }),
    })
      .then((r) => r.json())
      .then((j: {
        data?: {
          collection?: {
            handle: string
            title: string
            products: { edges: Array<{ node: { handle: string; title: string; featuredImage: { url: string; altText: string | null } | null; priceRange: { minVariantPrice: { amount: string; currencyCode: string } } } }> }
          } | null
        }
      }) => {
        if (cancelled) return
        const col = j.data?.collection
        if (!col) {
          setLiveProducts([])
          return
        }
        setLiveProducts(
          col.products.edges.map((e) => ({
            handle: e.node.handle,
            title: e.node.title,
            featuredImage: e.node.featuredImage
              ? {
                  url: e.node.featuredImage.url,
                  ...(e.node.featuredImage.altText
                    ? { altText: e.node.featuredImage.altText }
                    : {}),
                }
              : null,
            price: e.node.priceRange.minVariantPrice,
          })),
        )
      })
      .catch(() => {
        if (!cancelled) setLiveProducts([])
      })
    return () => {
      cancelled = true
    }
  }, [cacheUsable, handle, limit])

  const products: ProductCard[] = cacheUsable
    ? cachedProducts.map((p) => ({
        handle: p.handle,
        title: p.title,
        featuredImage: p.featuredImage ?? null,
        price: p.price,
      }))
    : livePrducts ?? []

  return (
    <section className="section">
      <div className="container">
        <div className="featured-collection__head">
          <div className="stack stack--sm">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2>{heading}</h2>
            {subheading && <p className="lede">{subheading}</p>}
          </div>
          {showViewAll && (
            <Link href={`/collections/${handle}`} className="btn btn--link">
              View all →
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="featured-collection__grid">
            {products.map((p) => (
              <Link key={p.handle} href={`/products/${p.handle}`} className="product-card">
                <div className="product-card__media">
                  <ImageResponsive src={p.featuredImage?.url} alt={p.featuredImage?.altText ?? p.title} />
                </div>
                <span className="product-card__title">{p.title}</span>
                <span className="product-card__price">
                  <Money value={p.price} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function EmptyState(): JSX.Element {
  return (
    <div className="card card--padded card--bordered u-text-center">
      <p className="u-text-muted">No products in this collection yet.</p>
    </div>
  )
}

export default defineSection({
  name: 'featured-collection',
  title: 'Featured collection',
  category: 'commerce',
  icon: '▦',
  attributes: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', default: 'Featured', label: 'Heading' },
    subheading: { type: 'text', label: 'Subheading' },
    collection: { type: 'collection', default: 'all', label: 'Collection' },
    limit: { type: 'number', default: 8, label: 'Max products' },
    showViewAll: { type: 'boolean', default: true, label: 'Show "View all" link' },
  },
  component: FeaturedCollection,
})
