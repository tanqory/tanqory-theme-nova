/**
 * Reusable UI primitive (= a Shopify "snippet") — NOT an editor section.
 * Sections import it; merchants configure it via the parent section's settings.
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

export function Button({
  label,
  link,
  variant = 'primary',
  size = 'md',
  className,
  fullWidth,
  onClick,
  disabled,
}: {
  label?: string
  link?: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  fullWidth?: boolean
  /** When provided (and no `link`), renders a real <button> that fires this. */
  onClick?: () => void
  disabled?: boolean
}): JSX.Element {
  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    fullWidth ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const style = fullWidth ? { width: '100%' } : undefined

  // An action button (add to cart, etc.) renders a <button>; a navigation
  // button renders an <a>. onClick takes precedence over link.
  if (onClick && !link) {
    return (
      <button type="button" className={classes} style={style} onClick={onClick} disabled={disabled}>
        {label ?? 'Button'}
      </button>
    )
  }

  return (
    <a className={classes} href={link ?? '#'} style={style}>
      {label ?? 'Button'}
    </a>
  )
}
