'use client';

import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import {motion} from 'framer-motion';
import {useState} from 'react';

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="mb-6 text-treasure-gold">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-aged-parchment font-secondary max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/${locale}/boucaniers`} className="btn btn-primary text-lg px-8 py-4">
                {t('hero.cta')} ⚔️
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating compass animation */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-treasure-gold bg-deep-navy bg-opacity-80 flex items-center justify-center text-treasure-gold text-2xl">
            🧭
          </div>
        </motion.div>
      </section>

      {/* Boucaniers Preview Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="parchment-container"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="mb-4 text-weathered-wood">{t('preview.title')}</h2>
                <p className="mb-6 text-weathered-wood text-lg">
                  {t('preview.description')}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <span className="bg-verdigris-copper text-bone-white px-3 py-1 rounded-full">
                    👥 {t('preview.players')}
                  </span>
                  <span className="bg-verdigris-copper text-bone-white px-3 py-1 rounded-full">
                    ⏱️ {t('preview.duration')}
                  </span>
                  <span className="bg-verdigris-copper text-bone-white px-3 py-1 rounded-full">
                    🎯 {t('preview.age')}
                  </span>
                </div>

                <Link href={`/${locale}/boucaniers`} className="btn btn-secondary">
                  {t('preview.moreInfo')} →
                </Link>
              </div>
              
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Image
                    src="/assets/assets_kick/1.webp"
                    alt="Boucaniers Game Box"
                    width={400}
                    height={400}
                    className="rounded-lg shadow-deep"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-pirate-red rounded-full flex items-center justify-content text-bone-white text-sm font-bold animate-pulse">
                    ⚡
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Follow Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="card max-w-md mx-auto">
              <h3 className="mb-4">{t('social.title')}</h3>
              <p className="mb-6 text-aged-parchment">{t('social.description')}</p>
              
              <div className="flex justify-center space-x-6">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-12 h-12 rounded-full bg-treasure-gold flex items-center justify-center text-weathered-wood text-xl hover:shadow-treasure"
                >
                  📘
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  className="w-12 h-12 rounded-full bg-treasure-gold flex items-center justify-center text-weathered-wood text-xl hover:shadow-treasure"
                >
                  🐦
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-12 h-12 rounded-full bg-treasure-gold flex items-center justify-center text-weathered-wood text-xl hover:shadow-treasure"
                >
                  📷
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="parchment-container max-w-lg mx-auto text-center"
          >
            <h3 className="mb-4 text-weathered-wood">{t('newsletter.title')}</h3>
            
            {isSubmitted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🍾</div>
                <p className="text-verdigris-copper font-bold">{t('newsletter.success')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    className="form-input"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary w-full"
                >
                  {t('newsletter.submit')} 🕊️
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section bg-deep-navy bg-opacity-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8">Découvrez le gameplay</h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video bg-weathered-wood rounded-lg overflow-hidden shadow-deep">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 rounded-full bg-pirate-red border-4 border-treasure-gold flex items-center justify-center text-bone-white text-3xl shadow-treasure"
                  >
                    ▶️
                  </motion.button>
                </div>
                <div className="absolute bottom-4 left-4 text-bone-white text-sm">
                  🎮 Demo sur Tabletop Simulator
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}