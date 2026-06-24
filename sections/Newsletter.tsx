import { defineSection, type SectionProps } from '@tanqory/theme-kit'

export function Newsletter({ attributes }: SectionProps): JSX.Element {
  const eyebrow = attributes.eyebrow as string | undefined
  const heading = (attributes.heading as string) ?? 'Join the newsletter'
  const body = attributes.body as string | undefined
  const placeholder = (attributes.placeholder as string) ?? 'you@example.com'
  const buttonLabel = (attributes.buttonLabel as string) ?? 'Subscribe'
  const note = attributes.note as string | undefined
  const action = attributes.action as string | undefined
  const inverse = Boolean(attributes.inverse)

  return (
    <section className={`section ${inverse ? 'section--inverse' : 'section--alt'}`}>
      <div className="container">
        <div className="newsletter">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{heading}</h2>
          {body && <p className="lede">{body}</p>}
          <form className="newsletter__form" action={action ?? '/_api/newsletter'} method="post">
            <input
              className="field__input"
              type="email"
              name="email"
              placeholder={placeholder}
              required
              autoComplete="email"
              aria-label="Email address"
            />
            <button className={`btn ${inverse ? 'btn--inverse' : 'btn--primary'}`} type="submit">
              {buttonLabel}
            </button>
          </form>
          {note && <small className="newsletter__note">{note}</small>}
        </div>
      </div>
    </section>
  )
}

export default defineSection({
  name: 'newsletter',
  title: 'Newsletter',
  category: 'marketing',
  icon: '✉',
  attributes: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', default: 'Join the newsletter', label: 'Heading' },
    body: {
      type: 'textarea',
      default: 'Be the first to hear about new arrivals and member-only sales — and get 10% off your first order.',
      label: 'Body',
    },
    placeholder: { type: 'text', default: 'you@example.com', label: 'Placeholder' },
    buttonLabel: { type: 'text', default: 'Subscribe', label: 'Button label' },
    note: { type: 'text', default: 'No spam. Unsubscribe anytime.', label: 'Footnote' },
    action: { type: 'url', label: 'Form action URL' },
    inverse: { type: 'boolean', default: false, label: 'Dark background' },
  },
  component: Newsletter,
})
