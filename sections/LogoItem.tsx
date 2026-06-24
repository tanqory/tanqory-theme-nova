import { defineSection, type SectionProps } from '@tanqory/theme-kit'

/**
 * Logo — CHILD BLOCK of Logo list. One brand mark (image URL + alt +
 * optional link). Replaces the old "Logos JSON" textarea with per-logo
 * blocks the merchant adds and reorders from the section tree.
 */
export function LogoItem({ attributes }: SectionProps): JSX.Element {
  const src = attributes.src as string | undefined
  const alt = (attributes.alt as string) ?? ''
  const href = attributes.href as string | undefined
  const inner = src ? (
    <img src={src} alt={alt} loading="lazy" decoding="async" />
  ) : (
    <span>{alt || 'Logo'}</span>
  )
  return href ? (
    <a href={href} className="logo-list__item">
      {inner}
    </a>
  ) : (
    <div className="logo-list__item">{inner}</div>
  )
}

export default defineSection({
  name: 'logo',
  title: 'Logo',
  category: 'block',
  icon: '◍',
  attributes: {
    src: { type: 'image', label: 'Image' },
    alt: { type: 'text', label: 'Brand name (alt text)' },
    href: { type: 'url', label: 'Link (optional)' },
  },
  component: LogoItem,
})
