import { defineSection, type SectionProps } from '@tanqory/theme-kit'

/**
 * FAQ item — CHILD BLOCK of FAQ. One question + answer pair; the merchant
 * adds/reorders entries from the section tree instead of editing an
 * items JSON textarea.
 */
export function FaqItem({ attributes }: SectionProps): JSX.Element {
  const q = attributes.question as string | undefined
  const a = attributes.answer as string | undefined
  return (
    <details className="faq__item">
      <summary className="faq__summary">{q ?? 'Question'}</summary>
      {a && <p className="faq__body">{a}</p>}
    </details>
  )
}

export default defineSection({
  name: 'faq-item',
  title: 'Question',
  category: 'block',
  icon: '?',
  attributes: {
    question: { type: 'text', default: 'Your question?', label: 'Question' },
    answer: { type: 'textarea', label: 'Answer' },
  },
  component: FaqItem,
})
