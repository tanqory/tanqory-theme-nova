import { useCart } from '@tanqory/theme-kit'
import { Drawer } from '../components/Drawer'
import { ImageResponsive } from '../components/ImageResponsive'
import { Money } from '../components/Money'
import { Button } from '../components/Button'
import { closeOverlay, useOverlay } from '../components/useOverlayChannel'

interface CartDrawerProps {
  width: string
  emptyHeading: string
  emptySubtext: string
  checkoutLabel: string
  viewCartLabel: string
}

/**
 * Slide-over cart summary — the "mini cart" pattern. Triggered by the header
 * 🛒 button or (optionally) auto-opens after add-to-cart. Shows live line
 * items, subtotal, checkout CTA + a "View full cart" escape hatch to `/cart`.
 *
 * Reads the real cart from `useCart()` (theme-kit): +/- update quantity,
 * Remove deletes the line, and the subtotal recomputes from the backend after
 * every mutation. In editor/offline (mock) mode the same controls drive an
 * in-memory cart so the surface still demonstrates correctly.
 */
export function CartDrawer(props: CartDrawerProps): JSX.Element {
  const open = useOverlay('cart')
  const { width: widthAttr, emptyHeading, emptySubtext, checkoutLabel, viewCartLabel } = props
  const { lines, subtotal, checkoutUrl, updateQuantity, remove } = useCart()

  return (
    <Drawer open={open} side="right" width={widthAttr} ariaLabel="Cart">
      <header className="drawer__head">
        <h2 className="drawer__title">Your cart</h2>
        <button
          type="button"
          className="drawer__close"
          aria-label="Close cart"
          onClick={() => closeOverlay()}
        >
          ✕
        </button>
      </header>

      {lines.length === 0 ? (
        <div className="drawer__empty">
          <h3>{emptyHeading}</h3>
          <p className="u-text-muted">{emptySubtext}</p>
          <Button label="Shop the collection" link="/collections/all" variant="primary" size="lg" />
        </div>
      ) : (
        <>
          <ul className="drawer__lines">
            {lines.map((l) => (
              <li key={l.id} className="drawer__line">
                <div className="drawer__thumb">
                  <ImageResponsive src={l.image?.url} alt={l.image?.altText ?? l.title} />
                </div>
                <div className="drawer__body">
                  <strong className="drawer__line-title">{l.title}</strong>
                  {l.variantTitle && (
                    <span className="u-text-muted drawer__variant">{l.variantTitle}</span>
                  )}
                  <div className="drawer__qty" role="group" aria-label="Quantity">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => void updateQuantity(l.id, l.quantity - 1)}
                    >
                      −
                    </button>
                    <span aria-live="polite">{l.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => void updateQuantity(l.id, l.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="drawer__line-price">
                  <Money value={l.lineSubtotal} />
                  <button
                    type="button"
                    className="drawer__remove"
                    aria-label={`Remove ${l.title}`}
                    onClick={() => void remove(l.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <footer className="drawer__foot">
            <div className="drawer__row">
              <span>Subtotal</span>
              <strong><Money value={subtotal} /></strong>
            </div>
            <p className="u-text-muted drawer__shipping-note">
              Shipping &amp; taxes calculated at checkout.
            </p>
            <Button
              label={checkoutLabel}
              link={checkoutUrl ?? '/checkout'}
              variant="primary"
              size="lg"
              fullWidth
            />
            <a href="/cart" className="drawer__view-cart" onClick={() => closeOverlay()}>
              {viewCartLabel} →
            </a>
          </footer>
        </>
      )}
    </Drawer>
  )
}

export default CartDrawer
