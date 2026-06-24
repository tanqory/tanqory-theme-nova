import { defineSection, type SectionProps } from '@tanqory/theme-kit'
import { Button } from '../components/Button'

export function Hero({ attributes }: SectionProps): JSX.Element {
  const {
    eyebrow,
    heading,
    subtext,
    buttonLabel,
    buttonLink,
    secondaryLabel,
    secondaryLink,
    backgroundImage,
  } = attributes as Record<string, string | undefined>

  const isMedia = Boolean(backgroundImage)

  return (
    <section className={`hero ${isMedia ? 'hero--media' : ''}`}>
      {isMedia && (
        <>
          <div className="hero__bg" style={{ backgroundImage: `url(${backgroundImage})` }} />
          <div className="hero__bg-overlay" />
        </>
      )}
      <div className="hero__inner">
        {eyebrow && <span className="hero__eyebrow">{eyebrow}</span>}
        <h1 className="hero__heading">{heading || 'Modern essentials'}</h1>
        {subtext && <p className="hero__subtext">{subtext}</p>}
        {(buttonLabel || secondaryLabel) && (
          <div className="hero__actions">
            {buttonLabel && (
              <Button
                label={buttonLabel}
                link={buttonLink}
                variant={isMedia ? 'inverse' : 'primary'}
                size="lg"
              />
            )}
            {secondaryLabel && (
              <Button label={secondaryLabel} link={secondaryLink} variant="ghost" size="lg" />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default defineSection({
  name: 'hero',
  title: 'Hero',
  category: 'layout',
  icon: '✦',
  attributes: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', default: 'Modern essentials', label: 'Heading' },
    subtext: {
      type: 'textarea',
      label: 'Subtext',
      default: 'Designed for everyday rituals — built to last beyond the season.',
    },
    buttonLabel: { type: 'text', default: 'Shop the collection', label: 'Primary button' },
    buttonLink: { type: 'url', default: '/collections/all', label: 'Primary button link' },
    secondaryLabel: { type: 'text', label: 'Secondary button' },
    secondaryLink: { type: 'url', label: 'Secondary button link' },
    backgroundImage: { type: 'image', label: 'Background image' },
  },
  component: Hero,
})
