'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {motion} from 'framer-motion';

export default function BoucaniersPage() {
  const t = useTranslations('boucaniers');

  const features = [
    { key: 'simultaneous', icon: '🧭' },
    { key: 'fluid', icon: '⚔️' },
    { key: 'epic', icon: '🏴‍☠️' },
    { key: 'depth', icon: '🏝️' },
    { key: 'playability', icon: '🎲' },
    { key: 'immersive', icon: '📜' }
  ];

  const components = [
    { name: '12 figurines de bateaux', icon: '⛵', detail: '3D printed, dual-color PLA' },
    { name: '10 fiches de bateaux', icon: '📋', detail: 'Unique ship profiles' },
    { name: '1 compass (rose des vents)', icon: '🧭', detail: 'Navigation tool' },
    { name: '35 lettres de marque', icon: '📜', detail: 'Authorization tokens' },
    { name: '40 jetons de dégâts et 20 d\'améliorations', icon: '🔧', detail: 'Ship modifications' },
    { name: '15 pièces d\'or', icon: '🪙', detail: 'Large treasure coins' },
    { name: '30 pièces de 1', icon: '🟡', detail: 'Small coins' },
    { name: '19 tuiles île', icon: '🏝️', detail: 'Modular board tiles' },
    { name: '20 rhums, 20 poudres à canon, 20 cannes à sucre', icon: '🍺', detail: 'Trade goods' },
    { name: '24 cartes boucaniers', icon: '👨‍🏴‍☠️', detail: 'Unique crew members' },
    { name: '9 cartes îles, 9 cartes indices', icon: '🗺️', detail: 'Story elements' },
    { name: '1 livret de règles illustré (30 pages)', icon: '📖', detail: 'Complete rulebook' }
  ];

  return (
    <div className="pt-20">
      {/* Game Header */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="mb-4">{t('title')}</h1>
            <p className="text-xl md:text-2xl mb-6 text-aged-parchment font-secondary max-w-3xl mx-auto">
              {t('tagline')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <span className="bg-verdigris-copper text-bone-white px-4 py-2 rounded-full">
                👥 2-5 joueurs
              </span>
              <span className="bg-verdigris-copper text-bone-white px-4 py-2 rounded-full">
                ⏱️ 30-60 minutes
              </span>
              <span className="bg-verdigris-copper text-bone-white px-4 py-2 rounded-full">
                🎯 10 ans et +
              </span>
            </div>
            <div className="text-4xl font-bold text-treasure-gold mb-8">
              {t('price')}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Game Description */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="parchment-container"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="mb-6 text-weathered-wood">Description du jeu</h2>
                <p className="text-lg text-weathered-wood leading-relaxed">
                  {t('description')}
                </p>
              </div>
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/assets/assets_kick/4.webp"
                    alt="Boucaniers Game Components"
                    width={500}
                    height={400}
                    className="rounded-lg shadow-deep"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            Caractéristiques du jeu
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card"
              >
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="mb-3 text-center text-treasure-gold">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-aged-parchment text-center">
                  {t(`features.${feature.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Components */}
      <section className="section bg-deep-navy bg-opacity-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="parchment-container"
          >
            <h2 className="text-center mb-8 text-weathered-wood">Contenu de la boîte</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map((component, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center p-3 bg-verdigris-copper bg-opacity-20 rounded-lg border border-verdigris-copper"
                >
                  <div className="text-2xl mr-3 flex-shrink-0">{component.icon}</div>
                  <div>
                    <div className="font-semibold text-weathered-wood text-sm">{component.name}</div>
                    <div className="text-xs text-weathered-wood opacity-75">{component.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <div className="inline-block p-4 bg-treasure-gold bg-opacity-20 rounded-lg border-2 border-treasure-gold">
                <h3 className="text-treasure-gold mb-2">Personnalisation</h3>
                <p className="text-weathered-wood">
                  Jetons de drapeau vierges inclus - Dessinez ou imprimez vos propres couleurs de pirate !
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            Galerie
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[6, 7, 8, 9, 10, 11].map((num, index) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="relative overflow-hidden rounded-lg shadow-deep"
              >
                <Image
                  src={`/assets/assets_kick/${num}.${num === 6 ? 'avif' : 'webp'}`}
                  alt={`Boucaniers Gallery ${num}`}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black from-0% to-transparent to-50% opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    <p className="text-sm">Découvrez l'univers des Boucaniers</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Context */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="parchment-container"
          >
            <div className="text-center">
              <h2 className="mb-6 text-weathered-wood">Contexte Historique</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏴‍☠️</div>
                  <h3 className="mb-3 text-verdigris-copper">Époque Authentique</h3>
                  <p className="text-weathered-wood text-sm">
                    Basé sur l'histoire maritime des Caraïbes du 17ème siècle
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="mb-3 text-verdigris-copper">Recherche Historique</h3>
                  <p className="text-weathered-wood text-sm">
                    Navires, équipements et rôles basés sur des documents d'époque
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🗺️</div>
                  <h3 className="mb-3 text-verdigris-copper">Géographie Réelle</h3>
                  <p className="text-weathered-wood text-sm">
                    Îles et routes commerciales inspirées de véritables cartes anciennes
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}