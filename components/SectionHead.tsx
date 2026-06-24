/**
 * SectionHead — the heading + optional subheading shared by every "themed"
 * section (Featured collection, Multicolumn, FAQ, …). Returns nothing when
 * both fields are empty so a section can be header-less without conditionals.
 */
export function SectionHead({
  heading,
  subheading,
  align = 'left',
}: {
  heading?: string
  subheading?: string
  align?: 'left' | 'center' | 'right'
}): JSX.Element | null {
  if (!heading && !subheading) return null
  return (
    <div className="section-head" style={{ textAlign: align }}>
      {heading && <h2>{heading}</h2>}
      {subheading && <p className="section-head__sub">{subheading}</p>}
    </div>
  )
}
