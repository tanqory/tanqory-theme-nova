import { defineSection, useData, type SectionProps } from '@tanqory/theme-kit'
import { Money } from '../components/Money'
import { Link } from '../components/Link'
import { ImageResponsive } from '../components/ImageResponsive'

export function SearchResults({ attributes }: SectionProps): JSX.Element {
  const { collectionByHandle } = useData()
  const query =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('q') ?? ''
      : ''
  const q = query.trim().toLowerCase()
  const all = collectionByHandle('all')?.products ?? []
  const results = q ? all.filter((p) => p.title.toLowerCase().includes(q)) : []
  const emptyHeading = (attributes.emptyHeading as string) ?? 'Search'

  return (
    <section className="section">
      <div className="container">
        <div className="search">
          <form
            className="search__form"
            action="/search"
            method="get"
            role="search"
            aria-label="Search products"
          >
            <input
              className="field__input"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search products…"
              aria-label="Search"
            />
            <button className="btn btn--primary" type="submit">
              Search
            </button>
          </form>

          {!q ? (
            <div className="search__empty">
              <h2>{emptyHeading}</h2>
              <p>{(attributes.emptySub as string) ?? 'Type a query above to find products.'}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="search__empty">
              <h2>No matches for “{query}”</h2>
              <p>Try a different search term, or browse the full collection.</p>
            </div>
          ) : (
            <>
              <p className="search__count">
                {results.length} {results.length === 1 ? 'result' : 'results'} for “{query}”
              </p>
              <div className="product-grid__grid">
                {results.map((p) => (
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
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default defineSection({
  name: 'search-results',
  title: 'Search results',
  category: 'commerce',
  icon: '⌕',
  attributes: {
    emptyHeading: { type: 'text', default: 'Find what you love', label: 'Empty-state heading' },
    emptySub: {
      type: 'text',
      default: 'Type a query above to find products.',
      label: 'Empty-state subtext',
    },
  },
  component: SearchResults,
})
