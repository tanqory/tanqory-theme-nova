import { defineSection, type SectionProps } from '@tanqory/theme-kit'
import { ImageResponsive } from '../components/ImageResponsive'
import { Button } from '../components/Button'

export function ImageWithText({ attributes }: SectionProps): JSX.Element {
  const reverse = Boolean(attributes.imageRight)
  const image = attributes.image as string | undefined
  const imageAlt = attributes.imageAlt as string | undefined
  const eyebrow = attributes.eyebrow as string | undefined
  const heading = (attributes.heading as string) ?? 'A story worth telling'
  const body = attributes.body as string | undefined
  const buttonLabel = attributes.buttonLabel as string | undefined
  const buttonLink = attributes.buttonLink as string | undefined

  return (
    <section className="section">
      <div className="container">
        <div className={`iwt ${reverse ? 'iwt--reverse' : ''}`}>
          <div className="iwt__media">
            <ImageResponsive src={image} alt={imageAlt ?? heading} />
          </div>
          <div className="iwt__body">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2>{heading}</h2>
            {body && <p>{body}</p>}
            {buttonLabel && (
              <div className="cluster">
                <Button label={buttonLabel} link={buttonLink} variant="secondary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default defineSection({
  name: 'image-with-text',
  title: 'Image with text',
  category: 'content',
  icon: '◧',
  attributes: {
    image: {
      type: 'image',
      label: 'Image',
      default: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271400%27%20height%3D%271000%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%27%20stop-color%3D%27%23374a40%27/%3E%3Cstop%20offset%3D%271%27%20stop-color%3D%27%235e7d6a%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27url%28%23g%29%27/%3E%3C/svg%3E',
    },
    imageAlt: { type: 'text', label: 'Image alt text' },
    imageRight: { type: 'boolean', default: false, label: 'Image on right' },
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', default: 'A story worth telling', label: 'Heading' },
    body: {
      type: 'textarea',
      label: 'Body',
      default:
        'Crafted in small batches with materials that age well. Every piece earns its place in your routine.',
    },
    buttonLabel: { type: 'text', label: 'Button label' },
    buttonLink: { type: 'url', label: 'Button link' },
  },
  component: ImageWithText,
})
