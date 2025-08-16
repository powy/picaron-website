'use client';

import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';
import {motion} from 'framer-motion';
import {useState} from 'react';

export default function ShopPage() {
  const t = useTranslations('shop');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement notification subscription
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const constructionSteps = [
    { icon: '🏗️', title: 'Architecture', status: 'completed', delay: 0 },
    { icon: '🎨', title: 'Design', status: 'completed', delay: 0.2 },
    { icon: '⚙️', title: 'Fonctionnalités', status: 'in-progress', delay: 0.4 },
    { icon: '🛒', title: 'Boutique', status: 'pending', delay: 0.6 },
    { icon: '🚀', title: 'Lancement', status: 'pending', delay: 0.8 }
  ];

  const futureFeatures = [
    {
      icon: '📦',
      title: 'Commande directe',
      description: 'Achetez Boucaniers directement depuis notre site'
    },
    {
      icon: '🎁',
      title: 'Éditions spéciales',
      description: 'Versions limitées et exclusives pour les collectionneurs'
    },
    {
      icon: '🧩',
      title: 'Extensions',
      description: 'Nouvelles cartes, îles et mécaniques de jeu'
    },
    {
      icon: '👕',
      title: 'Goodies',
      description: 'T-shirts, mugs et accessoires à l\'effigie de Boucaniers'
    },
    {
      icon: '📱',
      title: 'App companion',
      description: 'Application mobile pour enrichir l\'expérience de jeu'
    },
    {
      icon: '🌍',
      title: 'International',
      description: 'Livraison dans toute l\'Europe et au-delà'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-8xl mb-6"
            >
              🏴‍☠️
            </motion.div>
            <h1 className="mb-6">{t('title')}</h1>
            <p className="text-xl text-aged-parchment font-secondary max-w-3xl mx-auto mb-8">
              {t('description')}
            </p>
            <div className="inline-block bg-treasure-gold text-weathered-wood px-6 py-3 rounded-full font-bold text-lg">
              {t('comingSoon')} ⏳
            </div>
          </motion.div>
        </div>
      </section>

      {/* Construction Progress */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="parchment-container"
          >
            <h2 className="text-center mb-8 text-weathered-wood">Progression des travaux</h2>
            
            <div className="grid md:grid-cols-5 gap-4">
              {constructionSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: step.delay }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className={`w-16 h-16 mx-auto rounded-full border-4 flex items-center justify-center text-2xl mb-3 ${
                      step.status === 'completed' 
                        ? 'bg-treasure-gold border-verdigris-copper' 
                        : step.status === 'in-progress'
                        ? 'bg-pirate-red border-treasure-gold animate-pulse'
                        : 'bg-weathered-wood border-aged-parchment opacity-50'
                    }`}
                  >
                    {step.icon}
                  </motion.div>
                  <h4 className={`font-secondary text-sm ${
                    step.status === 'completed' 
                      ? 'text-verdigris-copper' 
                      : step.status === 'in-progress'
                      ? 'text-pirate-red'
                      : 'text-weathered-wood opacity-50'
                  }`}>
                    {step.title}
                  </h4>
                  <div className={`text-xs mt-1 ${
                    step.status === 'completed' 
                      ? 'text-green-600' 
                      : step.status === 'in-progress'
                      ? 'text-orange-500'
                      : 'text-gray-500'
                  }`}>
                    {step.status === 'completed' && '✅ Terminé'}
                    {step.status === 'in-progress' && '🔄 En cours'}
                    {step.status === 'pending' && '⏳ À venir'}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="bg-weathered-wood h-4 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '50%' }}
                  transition={{ duration: 2, delay: 1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-treasure-gold to-pirate-red h-full rounded-full relative"
                >
                  <motion.div
                    animate={{ x: [0, 20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute right-0 top-0 h-full w-4 bg-white bg-opacity-30 rounded-full"
                  />
                </motion.div>
              </div>
              <p className="text-center mt-2 text-weathered-wood text-sm">50% complété</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pirates at Work Animation */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8">Les pirates au travail</h2>
            <div className="relative max-w-2xl mx-auto">
              <div className="bg-verdigris-copper bg-opacity-20 rounded-lg p-8 border-2 border-verdigris-copper">
                {/* Animated construction scene */}
                <div className="flex justify-center items-end space-x-4">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    className="text-4xl"
                  >
                    👷‍♂️
                  </motion.div>
                  <motion.div
                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="text-3xl"
                  >
                    🔧
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    className="text-4xl"
                  >
                    🏴‍☠️
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="text-3xl"
                  >
                    ⚒️
                  </motion.div>
                </div>
                <p className="mt-6 text-aged-parchment">
                  Notre équipage travaille d'arrache-pied pour vous offrir la meilleure expérience d'achat !
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Future Features */}
      <section className="section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            Ce qui vous attend
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="text-4xl mb-4 text-center"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="mb-3 text-treasure-gold text-center">{feature.title}</h3>
                <p className="text-aged-parchment text-center text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notification Signup */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="parchment-container max-w-lg mx-auto text-center"
          >
            <h3 className="mb-4 text-weathered-wood">Soyez alerté de l'ouverture</h3>
            
            {isSubscribed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🏴‍☠️</div>
                <p className="text-verdigris-copper font-bold">
                  Parfait ! Vous serez parmi les premiers informés de l'ouverture de notre boutique !
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleNotifySubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="form-input bg-aged-parchment border-verdigris-copper text-weathered-wood"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary w-full"
                >
                  M'alerter à l'ouverture 🔔
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Alternative Actions */}
      <section className="section bg-deep-navy bg-opacity-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8">En attendant l'ouverture</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div whileHover={{ scale: 1.05 }} className="card">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-treasure-gold mb-3">Découvrez Boucaniers</h3>
                <p className="text-aged-parchment mb-4 text-sm">
                  Explorez en détail notre premier jeu et ses mécaniques innovantes
                </p>
                <Link href={`/${locale}/boucaniers`} className="btn btn-secondary">
                  En savoir plus
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="card">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-treasure-gold mb-3">Rencontrez l'équipe</h3>
                <p className="text-aged-parchment mb-4 text-sm">
                  Découvrez les corsaires qui créent vos futurs jeux préférés
                </p>
                <Link href={`/${locale}/team`} className="btn btn-secondary">
                  L'équipe
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="card">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-treasure-gold mb-3">Nous contacter</h3>
                <p className="text-aged-parchment mb-4 text-sm">
                  Une question ? Une suggestion ? Envoyez-nous un message !
                </p>
                <Link href={`/${locale}/contact`} className="btn btn-secondary">
                  Contact
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expected Launch Date */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-block parchment-container">
              <h3 className="text-weathered-wood mb-4">Date de lancement prévue</h3>
              <div className="text-4xl font-bold text-verdigris-copper mb-2">
                Q4 2024
              </div>
              <p className="text-weathered-wood text-sm">
                Juste à temps pour les fêtes de fin d'année ! 🎄
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}