import { defineSection, type SectionProps } from '@tanqory/theme-kit'
import { Button } from '../components/Button'

export function RichText({ attributes }: SectionProps): JSX.Element {
  const align = (attributes.align as 'left' | 'center') ?? 'center'
  const eyebrow = attributes.eyebrow as string | undefined
  const heading = attributes.heading as string | undefined
  const body = attributes.body as string | undefined
  const buttonLabel = attributes.buttonLabel as string | undefined
  const buttonLink = attributes.buttonLink as string | undefined

  return (
    <section className="section">
      <div className="container">
        <div className={`rich-text ${align === 'left' ? 'rich-text--left' : ''}`}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {heading && <h2>{heading}</h2>}
          {body && <p>{body}</p>}
          {buttonLabel && <Button label={buttonLabel} link={buttonLink} variant="secondary" />}
        </div>
      </div>
    </section>
  )
}

export default defineSection({
  name: 'rich-text',
  title: 'Rich text',
  category: 'content',
  icon: '¶',
  attributes: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', default: 'About our store', label: 'Heading' },
    body: {
      type: 'textarea',
      default:
        'Tell your story here. A short paragraph about who you are, what you make, and why it matters — three or four sentences is plenty.',
      label: 'Body',
    },
    buttonLabel: { type: 'text', label: 'Button label' },
    buttonLink: { type: 'url', label: 'Button link' },
    align: {
      type: 'select',
      default: 'center',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
      ],
    },
  },
  component: RichText,
})
