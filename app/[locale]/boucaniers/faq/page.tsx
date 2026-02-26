import { useTranslations } from 'next-intl'
import NewsletterSection from '@/components/NewsletterSection'
import SocialLinks from '@/components/SocialLinks'

export default function FAQPage() {
  const t = useTranslations('faq')

  return (
    <div className="mt-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="title-page">
          {t('pageTitle')}
        </h1>

        {/* FAQ Section */}
        <section className="mb-16">


          {/* Questions Container */}
          <div className="faq-container">
            {/* Question 1 */}
            <div className="faq-item border-t border-gold pt-6">
              <h3 className="heading-faq-question">
                {t('questions.q1.question')}
              </h3>
              <p className="text-ink leading-relaxed">
                {t('questions.q1.answer')}
              </p>
            </div>

            {/* Question 2 */}
            <div className="faq-item">
              <h3 className="heading-faq-question">
                {t('questions.q2.question')}
              </h3>
              <p className="text-ink leading-relaxed">
                {t('questions.q2.answer')}
              </p>
            </div>

            {/* Question 3 */}
            <div className="faq-item">
              <h3 className="heading-faq-question">
                {t('questions.q3.question')}
              </h3>
              <p className="text-ink leading-relaxed mb-4">
                {t('questions.q3.answer')}
              </p>
              <p className="text-ink leading-relaxed italic">
                {t('questions.q3.example')}
              </p>
            </div>

            {/* Question 4 */}
            <div className="faq-item">
              <h3 className="heading-faq-question">
                {t('questions.q4.question')}
              </h3>
              <p className="text-ink leading-relaxed">
                {t('questions.q4.answer')}
              </p>
            </div>

            {/* Question 5 */}
            <div className="faq-item">
              <h3 className="heading-faq-question">
                {t('questions.q5.question')}
              </h3>
              <p className="text-ink leading-relaxed">
                {t('questions.q5.answer')}
              </p>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <div className="mt-16 pt-8 border-t-2 border-gold">
          <div className="mb-8">
            <SocialLinks />
          </div>
          <div className="mb-16">
            <NewsletterSection />
          </div>
        </div>
      </div>
    </div>
  )
}
