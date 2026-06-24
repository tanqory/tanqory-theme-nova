import { defineSection, type SectionProps } from '@tanqory/theme-kit'

/**
 * Column — CHILD BLOCK of Multicolumn (category 'block' keeps it out of the
 * Add-section picker). One icon + heading + body card; the merchant adds,
 * reorders, and edits these from the section tree instead of hand-editing
 * an "Items JSON" textarea.
 */
export function ColumnItem({ attributes }: SectionProps): JSX.Element {
  const icon = attributes.icon as string | undefined
  const heading = attributes.heading as string | undefined
  const body = attributes.body as string | undefined
  return (
    <div className="multicolumn__item">
      {icon && (
        <div className="multicolumn__icon" aria-hidden>
          {icon}
        </div>
      )}
      {heading && <h3>{heading}</h3>}
      {body && <p className="u-text-muted">{body}</p>}
    </div>
  )
}

export default defineSection({
  name: 'column',
  title: 'Column',
  category: 'block',
  icon: '▥',
  attributes: {
    icon: { type: 'text', label: 'Icon (emoji or symbol)' },
    heading: { type: 'text', default: 'Feature', label: 'Heading' },
    body: { type: 'textarea', label: 'Body' },
  },
  component: ColumnItem,
})
