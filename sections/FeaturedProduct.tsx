import { useEffect, useState } from 'react'
import { defineSection, useData, type SectionProps } from '@tanqory/theme-kit'
import { apiBase } from '../lib/api-base'
import { ImageResponsive } from '../components/ImageResponsive'
import { Money } from '../components/Money'
import { Button } from '../components/Button'

interface ProductData {
  handle: string
  title: string
  featuredImage: { url: string; altText?: string } | null
  price: { amount: string; currencyCode: string }
}

export function FeaturedProduct({ attributes }: SectionProps): JSX.Element {
  const { productByHandle, collectionByHandle } = useData()
  const handle = attributes.product as string | undefined
  const fromHandle = handle ? productByHandle(handle) : null
  const fallback = collectionByHandle('all')?.products?.[0] ?? null

  // Live-fetch when the merchant picked a product that wasn't in the
  // bootstrap window. Same pattern as FeaturedCollection — keeps every
  // catalogue handle renderable, not just the prefetched batch.
  const [livePrduct, setLiveProduct] = useState<ProductData | null>(null)
  useEffect(() => {
    if (!handle || fromHandle) {
      setLiveProduct(null)
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
        query: `query P($h: String) {
          product(handle: $h) {
            handle
            title
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }`,
        variables: { h: handle },
      }),
    })
      .then((r) => r.json())
      .then((j: {
        data?: {
          product?: {
            handle: string
            title: string
            featuredImage: { url: string; altText: string | null } | null
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
          } | null
        }
      }) => {
        if (cancelled) return
        const p = j.data?.product
        setLiveProduct(
          p
            ? {
                handle: p.handle,
                title: p.title,
                featuredImage: p.featuredImage
                  ? {
                      url: p.featuredImage.url,
                      ...(p.featuredImage.altText ? { altText: p.featuredImage.altText } : {}),
                    }
                  : null,
                price: p.priceRange.minVariantPrice,
              }
            : null,
        )
      })
      .catch(() => {
        if (!cancelled) setLiveProduct(null)
      })
    return () => {
      cancelled = true
    }
  }, [handle, fromHandle])

  const product: ProductData | null =
    fromHandle
      ? {
          handle: fromHandle.handle,
          title: fromHandle.title,
          featuredImage: fromHandle.featuredImage ?? null,
          price: fromHandle.price,
        }
      : livePrduct
        ?? (fallback
          ? {
              handle: fallback.handle,
              title: fallback.title,
              featuredImage: fallback.featuredImage ?? null,
              price: fallback.price,
            }
          : null)

  if (!product) {
    return (
      <section className="section">
        <div className="container">
          <div className="card card--padded card--bordered u-text-center">
            <p className="u-text-muted">Select a product in the editor.</p>
          </div>
        </div>
      </section>
    )
  }

  const eyebrow = attributes.eyebrow as string | undefined
  const body = attributes.body as string | undefined

  return (
    <section className="section section--alt">
      <div className="container">
        <div className="featured-product">
          <div className="featured-product__media">
            <ImageResponsive
              src={product.featuredImage?.url}
              alt={product.featuredImage?.altText ?? product.title}
            />
          </div>
          <div className="featured-product__body">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 className="featured-product__title">{product.title}</h2>
            <span className="featured-product__price">
              <Money value={product.price} />
            </span>
            {body && <p className="u-text-muted" style={{ maxWidth: '50ch' }}>{body}</p>}
            <div className="cluster">
              <Button
                label={(attributes.buttonLabel as string) ?? 'Shop now'}
                link={(attributes.buttonLink as string) ?? `/products/${product.handle}`}
                variant="primary"
                size="lg"
              />
              <Button label="View details" link={`/products/${product.handle}`} variant="ghost" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default defineSection({
  name: 'featured-product',
  title: 'Featured product',
  category: 'commerce',
  icon: '★',
  attributes: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    product: { type: 'product', label: 'Product' },
    body: { type: 'textarea', label: 'Description' },
    buttonLabel: { type: 'text', default: 'Shop now', label: 'Button label' },
    buttonLink: { type: 'url', label: 'Button link (auto = product page)' },
  },
  component: FeaturedProduct,
})
