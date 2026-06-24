import { defineSection, useData, type SectionProps } from '@tanqory/theme-kit'
import { Link } from '../components/Link'
import { ImageResponsive } from '../components/ImageResponsive'

/**
 * Collection card — a CHILD BLOCK of the Collection List section
 * (category: 'block' keeps it out of the Add-section picker; the editor
 * offers it via Collection List's Add-block UI instead).
 *
 * Each instance points at one collection by handle. Title/image override
 * the collection's own when set, so merchants can curate the card without
 * touching the catalogue.
 */
export function CollectionItem({ attributes }: SectionProps): JSX.Element {
  const { collectionByHandle } = useData()
  const handle = (attributes.collection as string) ?? ''
  const titleOverride = attributes.title as string | undefined
  const c = handle ? collectionByHandle(handle) : null

  if (!c) {
    return (
      <div className="collection-card collection-card--empty card card--bordered u-text-center">
        <span className="u-text-muted">{handle ? `Collection "${handle}" not found` : 'Pick a collection'}</span>
      </div>
    )
  }

  const heroUrl = c.image?.url ?? c.products[0]?.featuredImage?.url
  const heroAlt = c.image?.altText ?? c.title
  return (
    <Link href={`/collections/${c.handle}`} className="collection-card">
      <ImageResponsive src={heroUrl} alt={heroAlt} />
      <div className="collection-card__overlay">
        <span className="collection-card__title">{titleOverride || c.title}</span>
      </div>
    </Link>
  )
}

export default defineSection({
  name: 'collection-item',
  title: 'Collection',
  category: 'block',
  icon: '▢',
  attributes: {
    collection: { type: 'collection', label: 'Collection' },
    title: { type: 'text', label: 'Title override' },
  },
  component: CollectionItem,
})
