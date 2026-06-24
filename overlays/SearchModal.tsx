import { useEffect, useMemo, useRef, useState } from 'react'
import { useData } from '@tanqory/theme-kit'
import { Modal } from '../components/Modal'
import { ImageResponsive } from '../components/ImageResponsive'
import { Money } from '../components/Money'
import { useOverlay } from '../components/useOverlayChannel'

interface SearchModalProps {
  placeholder: string
  ctaLabel: string
  maxWidth: string
  debounceMs: number
  maxResults: number
}

/**
 * Predictive search overlay — replaces a full page navigation to `/search`
 * with an instant, debounced search-as-you-type experience.
 *
 * Phase 1 (this file): client-side filter over the bootstrap product list
 * already in memory. Zero extra round-trips, instant feedback. Good enough
 * for catalogues up to a few hundred SKUs, which is the bootstrap limit.
 *
 * Phase 2 (when needed): swap the matchProducts call for the storefront
 * `predictiveSearch` GraphQL query (resolver already wired). Same shape.
 */
export function SearchModal(props: SearchModalProps): JSX.Element {
  const open = useOverlay('search')
  const data = useData()
  const { placeholder, ctaLabel, maxWidth, debounceMs, maxResults } = props

  const [term, setTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset on close so reopening starts clean.
  useEffect(() => {
    if (!open) {
      setTerm('')
      setDebouncedTerm('')
    }
  }, [open])

  // Focus the input when the overlay OPENS — not via the autoFocus
  // attribute, which fires at mount while the modal is still hidden
  // (Modal stays mounted with aria-hidden). That mount-time focus both
  // tripped Chrome's cross-origin-iframe autofocus block (red console
  // error on every page load inside the editor canvas) and parked focus
  // inside an aria-hidden subtree (WAI-ARIA violation warning).
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Debounce the input so we don't filter on every keystroke. Important when
  // the catalogue is larger and the filter becomes non-trivial.
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedTerm(term.trim()), debounceMs)
    return () => window.clearTimeout(id)
  }, [term, debounceMs])

  // Flatten products across collections + dedupe by handle. Same canonical
  // product takes its first collection appearance (matches the bootstrap
  // dedup in createMockData).
  const allProducts = useMemo(() => {
    const seen = new Set<string>()
    const out: ReturnType<typeof data.allCollections>[number]['products'] = []
    for (const c of data.allCollections()) {
      for (const p of c.products) {
        if (!seen.has(p.handle)) {
          seen.add(p.handle)
          out.push(p)
        }
      }
    }
    return out
  }, [data])

  const results = useMemo(() => {
    if (!debouncedTerm) return []
    const q = debouncedTerm.toLowerCase()
    return allProducts.filter((p) => p.title.toLowerCase().includes(q)).slice(0, maxResults)
  }, [allProducts, debouncedTerm, maxResults])

  return (
    <Modal open={open} maxWidth={maxWidth} ariaLabel="Search">
      <div className="search-modal">
        <label className="search-modal__field">
          <span className="visually-hidden">Search</span>
          <input
            ref={inputRef}
            type="search"
            className="search-modal__input"
            placeholder={placeholder}
            value={term}
            onChange={(e) => setTerm(e.currentTarget.value)}
            autoComplete="off"
            spellCheck={false}
          />
          {term && (
            <button
              type="button"
              className="search-modal__clear"
              aria-label="Clear search"
              onClick={() => setTerm('')}
            >
              ✕
            </button>
          )}
        </label>

        {debouncedTerm && (
          <div className="search-modal__results" role="listbox" aria-label="Search results">
            {results.length === 0 ? (
              <p className="search-modal__empty u-text-muted">No matches for “{debouncedTerm}”.</p>
            ) : (
              <>
                <ul>
                  {results.map((p) => (
                    <li key={p.handle} role="option" aria-selected="false">
                      <a className="search-modal__hit" href={`/products/${p.handle}`}>
                        <div className="search-modal__thumb">
                          <ImageResponsive
                            src={p.featuredImage?.url}
                            alt={p.featuredImage?.altText ?? p.title}
                          />
                        </div>
                        <div className="search-modal__hit-body">
                          <strong className="search-modal__hit-title">{p.title}</strong>
                          <Money value={p.price} />
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
                <a href={`/search?q=${encodeURIComponent(debouncedTerm)}`} className="search-modal__cta">
                  {ctaLabel}
                </a>
              </>
            )}
          </div>
        )}

        {!debouncedTerm && (
          <p className="search-modal__hint u-text-muted">
            Type to search products, collections, and pages. <kbd>Esc</kbd> to close.
          </p>
        )}
      </div>
    </Modal>
  )
}

export default SearchModal
