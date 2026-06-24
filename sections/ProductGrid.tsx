import { defineSection, useData, type SectionProps } from '@tanqory/theme-kit'
import { Price } from '../components/Price'

export function ProductGrid({ attributes }: SectionProps): JSX.Element {
  const { collectionByHandle } = useData()
  const handle = (attributes.collection as string) ?? 'all'
  const collection = collectionByHandle(handle)
  const products = collection?.products ?? []
  const heading = attributes.heading as string | undefined
  const subheading = attributes.subheading as string | undefined

  return (
    <section className="section">
      <div className="container">
        {(heading || subheading) && (
          <div className="product-grid__head">
            {heading && <h2>{heading}</h2>}
            {subheading && <p className="lede">{subheading}</p>}
          </div>
        )}

        {products.length === 0 ? (
          <div className="card card--padded card--bordered u-text-center">
            <p className="u-text-muted">No products to show.</p>
          </div>
        ) : (
          <div className="product-grid__grid">
            {products.map((p) => (
              <a key={p.handle} className="product-card" href={`/products/${p.handle}`}>
                <div className="product-card__media">
                  {p.featuredImage && (
                    <img
                      src={p.featuredImage.url}
                      alt={p.featuredImage.altText ?? p.title}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                <span className="product-card__title">{p.title}</span>
                <span className="product-card__price">
                  <Price money={p.price} />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default defineSection({
  name: 'product-grid',
  title: 'Product grid',
  category: 'commerce',
  icon: '▦',
  attributes: {
    heading: { type: 'text', default: 'Shop the collection', label: 'Heading' },
    subheading: { type: 'text', label: 'Subheading' },
    collection: { type: 'collection', default: 'all', label: 'Collection' },
  },
  component: ProductGrid,
})
