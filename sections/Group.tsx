import { defineSection, type SectionProps } from '@tanqory/theme-kit'

/** A container section — renders nested child sections. Enables nesting. */
export function Group({ attributes, children }: SectionProps): JSX.Element {
  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gap: `${attributes.gap ?? 16}px` }}>
        {children}
      </div>
    </section>
  )
}

export default defineSection({
  name: 'group',
  title: 'Group',
  category: 'layout',
  icon: '▤',
  attributes: {
    gap: { type: 'number', default: 16, label: 'Gap (px)' },
  },
  allowedBlocks: [
    'cart-items', 'collection-list', 'contact-form', 'faq',
    'featured-collection', 'featured-product', 'group', 'hero',
    'image-with-text', 'logo-list', 'multicolumn', 'newsletter',
    'not-found', 'product-details', 'product-grid', 'rich-text',
    'search-results', 'slideshow',
  ],
  component: Group,
})
