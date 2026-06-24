import { defineSection, type SectionProps } from '@tanqory/theme-kit'
import { Button } from '../components/Button'

export function NotFound({ attributes }: SectionProps): JSX.Element {
  const heading = (attributes.heading as string) ?? 'Page not found'
  const body =
    (attributes.body as string) ??
    'The page you\'re looking for doesn\'t exist or may have moved.'
  const buttonLabel = (attributes.buttonLabel as string) ?? 'Back to home'
  const buttonLink = (attributes.buttonLink as string) ?? '/'

  return (
    <section className="section">
      <div className="container">
        <div className="not-found">
          <div className="not-found__code" aria-hidden>
            404
          </div>
          <h1>{heading}</h1>
          <p className="u-text-muted">{body}</p>
          <div className="cluster">
            <Button label={buttonLabel} link={buttonLink} variant="primary" size="lg" />
            <Button label="Browse the shop" link="/collections/all" variant="ghost" size="lg" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default defineSection({
  name: 'not-found',
  title: '404',
  category: 'system',
  icon: '⚠',
  attributes: {
    heading: { type: 'text', default: 'Page not found', label: 'Heading' },
    body: {
      type: 'textarea',
      default: 'The page you\'re looking for doesn\'t exist or may have moved.',
      label: 'Body',
    },
    buttonLabel: { type: 'text', default: 'Back to home', label: 'Button label' },
    buttonLink: { type: 'url', default: '/', label: 'Button link' },
  },
  component: NotFound,
})
