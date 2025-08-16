'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {useState} from 'react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual email sending
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      value: 'contact@picaron.fr',
      description: 'Pour toute question générale'
    },
    {
      icon: '🏢',
      title: 'Adresse',
      value: 'Picaron SARL',
      description: 'France'
    },
    {
      icon: '🐦',
      title: 'Réseaux sociaux',
      value: '@PicaronGames',
      description: 'Suivez nos actualités'
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
              Envoyez-nous un message par pigeon voyageur... ou utilisez le formulaire ci-dessous !
            </p>
          </motion.div>
        </div>
      </section>

      <div className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="parchment-container">
                <h2 className="mb-6 text-weathered-wood text-center">Livre de bord - Nouveau message</h2>
                
                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="text-6xl mb-6"
                    >
                      🕊️
                    </motion.div>
                    <h3 className="text-verdigris-copper mb-4">Message envoyé !</h3>
                    <p className="text-weathered-wood">
                      Votre pigeon voyageur a pris son envol. Nous vous répondrons dans les plus brefs délais !
                    </p>
                    <motion.button
                      onClick={() => setIsSubmitted(false)}
                      whileHover={{ scale: 1.05 }}
                      className="btn btn-secondary mt-6"
                    >
                      Envoyer un autre message
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label text-verdigris-copper">
                          {t('form.name')} *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-input bg-aged-parchment border-verdigris-copper text-weathered-wood"
                          required
                          placeholder="Votre nom de corsaire..."
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label text-verdigris-copper">
                          {t('form.email')} *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-input bg-aged-parchment border-verdigris-copper text-weathered-wood"
                          required
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label text-verdigris-copper">
                        {t('form.subject')} *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="form-input bg-aged-parchment border-verdigris-copper text-weathered-wood"
                        required
                        placeholder="Sujet de votre message..."
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label text-verdigris-copper">
                        {t('form.message')} *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="form-input bg-aged-parchment border-verdigris-copper text-weathered-wood resize-none"
                        required
                        placeholder="Rédigez votre message ici..."
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      className={`btn btn-primary w-full ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="loading-spinner mr-2"></div>
                          Envoi en cours...
                        </span>
                      ) : (
                        `${t('form.submit')} 🕊️`
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="mb-8">Autres moyens de nous contacter</h2>
              
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="card"
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="text-3xl"
                    >
                      {method.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-treasure-gold mb-2">{method.title}</h3>
                      <p className="text-bone-white font-semibold mb-1">{method.value}</p>
                      <p className="text-aged-parchment text-sm">{method.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="card"
              >
                <h3 className="text-treasure-gold mb-4">Questions fréquentes</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-bone-white font-semibold mb-1">📦 Livraison</h4>
                    <p className="text-aged-parchment text-sm">
                      Nous livrons partout en France métropolitaine. Délai standard : 3-5 jours ouvrés.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-bone-white font-semibold mb-1">🎮 Disponibilité</h4>
                    <p className="text-aged-parchment text-sm">
                      Boucaniers sera disponible fin 2024. Inscrivez-vous à notre newsletter pour être informé !
                    </p>
                  </div>
                  <div>
                    <h4 className="text-bone-white font-semibold mb-1">💰 Prix</h4>
                    <p className="text-aged-parchment text-sm">
                      Le prix de vente conseillé est de 69€. Des promotions seront proposées lors du lancement.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Response Time Info */}
      <section className="section bg-deep-navy bg-opacity-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-6">Temps de réponse</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-treasure-gold mb-2">Questions urgentes</h3>
                <p className="text-aged-parchment">24h maximum</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-treasure-gold mb-2">Questions générales</h3>
                <p className="text-aged-parchment">48-72h</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-treasure-gold mb-2">Partenariats</h3>
                <p className="text-aged-parchment">1 semaine</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}