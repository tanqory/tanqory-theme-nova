import { defineSection, type SectionProps } from '@tanqory/theme-kit'

export function ContactForm({ attributes }: SectionProps): JSX.Element {
  const heading = (attributes.heading as string) ?? 'Get in touch'
  const subheading = attributes.subheading as string | undefined
  const buttonLabel = (attributes.buttonLabel as string) ?? 'Send message'
  const action = (attributes.action as string) ?? '/_api/contact'
  const showPhone = Boolean(attributes.showPhone)

  return (
    <section className="section">
      <div className="container">
        <div className="contact">
          <div className="contact__head">
            <h2>{heading}</h2>
            {subheading && <p className="lede">{subheading}</p>}
          </div>
          <form className="contact__form" action={action} method="post">
            <label className="field">
              <span className="field__label">First name</span>
              <input
                className="field__input"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
              />
            </label>
            <label className="field">
              <span className="field__label">Last name</span>
              <input
                className="field__input"
                name="lastName"
                type="text"
                autoComplete="family-name"
              />
            </label>
            <label className="field field--full">
              <span className="field__label">Email</span>
              <input
                className="field__input"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </label>
            {showPhone && (
              <label className="field field--full">
                <span className="field__label">Phone (optional)</span>
                <input className="field__input" name="phone" type="tel" autoComplete="tel" />
              </label>
            )}
            <label className="field field--full">
              <span className="field__label">Message</span>
              <textarea className="field__textarea" name="message" required />
            </label>
            <div className="field--full" style={{ marginTop: 'var(--space-3)' }}>
              <button className="btn btn--primary btn--lg" type="submit">
                {buttonLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default defineSection({
  name: 'contact-form',
  title: 'Contact form',
  category: 'forms',
  icon: '✉',
  attributes: {
    heading: { type: 'text', default: 'Get in touch', label: 'Heading' },
    subheading: {
      type: 'text',
      default: "We'll reply within one business day.",
      label: 'Subheading',
    },
    showPhone: { type: 'boolean', default: false, label: 'Show phone field' },
    buttonLabel: { type: 'text', default: 'Send message', label: 'Button label' },
    action: { type: 'url', label: 'Form action URL' },
  },
  component: ContactForm,
})
