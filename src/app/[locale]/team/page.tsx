'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';

export default function TeamPage() {
  const t = useTranslations('team');

  const teamMembers = [
    {
      key: 'vincent',
      avatar: '👨‍🎨',
      ship: '🏴‍☠️',
      specialty: 'Création & Design'
    },
    {
      key: 'thierry',
      avatar: '👨‍💼',
      ship: '⚓',
      specialty: 'Mécaniques de jeu'
    },
    {
      key: 'remi',
      avatar: '👨‍🔧',
      ship: '🔧',
      specialty: 'Fabrication'
    },
    {
      key: 'maxime',
      avatar: '👨‍✈️',
      ship: '🧭',
      specialty: 'Direction'
    }
  ];

  const companyValues = [
    {
      icon: '🇫🇷',
      title: 'Excellence Française',
      description: 'Fabrication artisanale de qualité, made in France'
    },
    {
      icon: '🎯',
      title: 'Jeux Stratégiques',
      description: 'Mécaniques innovantes pour des expériences immersives'
    },
    {
      icon: '📚',
      title: 'Respect de l\'Histoire',
      description: 'Recherche historique approfondie pour l\'authenticité'
    },
    {
      icon: '🎲',
      title: 'Innovation Ludique',
      description: 'Nouvelles mécaniques qui révolutionnent le jeu de société'
    }
  ];

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="mb-6">{t('title')}</h1>
            <p className="text-xl text-aged-parchment font-secondary max-w-3xl mx-auto">
              Rencontrez l'équipage qui navigue vers de nouveaux horizons ludiques
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ship Background Section */}
      <section className="section relative">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-r from-sea-mist-green to-verdigris-copper"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.key}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="parchment-container"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar and Ship */}
                  <div className="flex-shrink-0 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-20 h-20 rounded-full bg-verdigris-copper border-4 border-treasure-gold flex items-center justify-center text-4xl mb-2 shadow-treasure"
                    >
                      {member.avatar}
                    </motion.div>
                    <div className="text-2xl">{member.ship}</div>
                    <div className="text-xs text-weathered-wood font-script">
                      {member.specialty}
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="flex-grow">
                    <h3 className="text-verdigris-copper mb-2 font-secondary">
                      {t(`members.${member.key}.name`)}
                    </h3>
                    <div className="inline-block bg-treasure-gold text-weathered-wood px-3 py-1 rounded-full text-sm font-bold mb-3">
                      {t(`members.${member.key}.role`)}
                    </div>
                    <p className="text-weathered-wood leading-relaxed">
                      {t(`members.${member.key}.description`)}
                    </p>
                  </div>
                </div>

                {/* Decorative element */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.3 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-pirate-red rounded-full border-2 border-treasure-gold flex items-center justify-center text-bone-white text-sm"
                >
                  ⚓
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values - Code des Pirates */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-6">Le Code des Pirates de Picaron</h2>
            <p className="text-xl text-aged-parchment font-secondary max-w-3xl mx-auto">
              Nos valeurs qui guident chaque création
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="card text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="text-5xl mb-4"
                >
                  {value.icon}
                </motion.div>
                <h3 className="mb-3 text-treasure-gold">{value.title}</h3>
                <p className="text-aged-parchment text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="parchment-container max-w-4xl mx-auto"
          >
            <div className="text-center">
              <h2 className="mb-6 text-weathered-wood">L'Histoire de Picaron</h2>
              
              <div className="space-y-6 text-weathered-wood leading-relaxed">
                <p className="text-lg">
                  <strong>Picaron</strong> est né de la passion commune de créateurs de jeux passionnés d'histoire maritime. 
                  Fondée par une équipe de concepteurs, ingénieurs et artistes, notre maison d'édition s'est donnée 
                  pour mission de créer des jeux de société qui allient mécaniques innovantes et authenticité historique.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🎯</div>
                    <h4 className="font-secondary text-verdigris-copper mb-2">Notre Mission</h4>
                    <p className="text-sm">
                      Créer des expériences ludiques immersives qui transportent les joueurs 
                      dans des univers historiques authentiques.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl mb-3">🌟</div>
                    <h4 className="font-secondary text-verdigris-copper mb-2">Notre Vision</h4>
                    <p className="text-sm">
                      Devenir la référence française pour les jeux de société historiques 
                      alliant stratégie, immersion et qualité artisanale.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl mb-3">⚓</div>
                    <h4 className="font-secondary text-verdigris-copper mb-2">Nos Valeurs</h4>
                    <p className="text-sm">
                      Excellence, authenticité, innovation et respect de l'artisanat français 
                      dans chaque détail de nos créations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-deep-navy bg-opacity-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-6">Rejoignez l'aventure Picaron</h2>
            <p className="text-xl text-aged-parchment mb-8 max-w-3xl mx-auto">
              Suivez-nous dans nos péripéties créatives et soyez les premiers informés 
              de nos prochaines sorties et événements.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="#newsletter"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
              >
                📧 Newsletter
              </motion.a>
              <motion.a
                href="#social"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary"
              >
                🐦 Réseaux sociaux
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}