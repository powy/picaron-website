import { useTranslations } from 'next-intl'
import NewsletterSection from '@/components/NewsletterSection'
import SocialLinks from '@/components/SocialLinks'
import Image from 'next/image'

export default function HomePage() {
  const t = useTranslations('home')
  
  return (
    <div className="mt-8">
      {/* Hero Section with Title */}
      <section className="text-center py-8">
        <h1 className="text-6xl font-oldstyle text-[#0c0c0d] mb-8 leading-tight">
          {t('title')}
        </h1>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto relative">
        {/* ImageA - Top Left */}
        <div className="absolute top-0 left-0 z-10">
          <Image
            src="/assets/assets_old_web/imageA.png"
            alt="Game Image A"
            width={300}
            height={200}
          />
        </div>

        {/* ImageB - Middle Right */}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
          <Image
            src="/assets/assets_old_web/imageB.png"
            alt="Game Image B"
            width={300}
            height={200}
          />
        </div>

        {/* ImageD - Lower Left */}
        <div className="absolute top-3/4 left-0 transform -translate-y-1/2 z-10">
          <Image
            src="/assets/assets_old_web/imageD.png"
            alt="Game Image D"
            width={300}
            height={200}
          />
        </div>

        {/* YouTube Video - Center */}
        <section className="text-center mb-12 pt-32">
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/v7zy4lBjHRo?start=88"
                title="Picaron Game Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mb-8">
            <a 
              href="/boucaniers"
              className="inline-block bg-[#8b2020] text-[#faf8f3] px-10 py-4 rounded-lg font-oldstyle text-2xl hover:bg-[#a02525] transition shadow-lg"
            >
              {t('cta')}
            </a>
          </div>
        </section>


        {/* Social Media Links */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-oldstyle text-[#0c0c0d] mb-6">{t('followUs')}</h3>
          <SocialLinks />
        </div>

        {/* Newsletter Section */}
        <div className="mb-16">
          <NewsletterSection />
        </div>

      </div>
    </div>
  )
}