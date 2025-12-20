import { useTranslations } from 'next-intl'
import NewsletterSection from '@/components/NewsletterSection'
import SocialLinks from '@/components/SocialLinks'

export default function FAQPage() {
  const t = useTranslations('faq')

  return (
    <div className="mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="heading-section">FAQ - Questions Fréquentes</h1>

        {/* Boucaniers Section */}
        <section className="mb-16">
          <h2 className="heading-subsection">
            FAQ Boucaniers
          </h2>

          <div className="space-y-8">
            {/* Question 1 */}
            <div className="border-b border-gold pb-6">
              <h3 className="heading-faq-question">
                Le tour où l'on annonce la fouille est-il décompté dans le temps de fouille ?
              </h3>
              <p className="text-ink leading-relaxed">
                Oui, on annonce la fouille au début du tour, et la fin de ce même tour compte déjà pour un tour.
                Le joueur doit donc rester 3 tours de plus après. Ainsi, le boucanier démolisseur finit la fouille
                dès l'instant où le joueur annonce la fouille, tant que le bateau n'est pas pris dans un abordage
                ou n'a pas fait naufrage.
              </p>
            </div>

            {/* Question 2 */}
            <div className="border-b border-gold pb-6">
              <h3 className="heading-faq-question">
                Comment décompter le temps de fouille ?
              </h3>
              <p className="text-ink leading-relaxed">
                Au moment où vous annoncez la fouille, mettez le compas sur le nombre de tours qu'il vous est
                nécessaire pour fouiller (4 tours moins le nombre de fragments possédés et moins le boucanier de
                l'Homme au tatouage s'il est embarqué). Si vous souhaitez continuer à fouiller au prochain tour,
                pointez la flèche de votre compas sur l'homme à la pelle et indiquez un tour de moins pour le
                chiffre et ainsi de suite les prochains tours. Si vous souhaitez vous déplacer au lieu de fouiller,
                vous pouvez régler votre compas sur un cap et une distance de navigation.
              </p>
            </div>

            {/* Question 3 */}
            <div className="border-b border-gold pb-6">
              <h3 className="heading-faq-question">
                J'ai découvert une carte indice, comment interpréter le symbole sur la carte ?
              </h3>
              <p className="text-ink leading-relaxed mb-2">
                Le symbole signifie que les deux îles sur lesquelles il est dessiné ne contiennent pas le trésor.
              </p>
              <p className="text-ink leading-relaxed italic">
                Exemple : si vous piochez l'indice Volcan, cela signifie que le trésor ne se trouve ni sur l'île
                déserte ni sur l'île du Perroquet Bavard.
              </p>
            </div>

            {/* Question 4 */}
            <div className="border-b border-gold pb-6">
              <h3 className="heading-faq-question">
                Les Compagnies des Indes peuvent-elles se rejoindre ?
              </h3>
              <p className="text-ink leading-relaxed">
                Jamais. Les deux navires sont soit à 4 soit à 5 segments de distance l'un de l'autre. S'ils se
                rejoignent, c'est qu'il y a eu une erreur dans le placement de la réapparition ou un oubli dans
                le déplacement.
              </p>
            </div>

            {/* Question 5 */}
            <div className="border-b border-gold pb-6">
              <h3 className="heading-faq-question">
                Les navires des Compagnies des Indes réapparaissent-ils en ligne droite ? Comment bien les replacer ?
              </h3>
              <p className="text-ink leading-relaxed">
                Ils réapparaissent à l'opposé, en miroir, sur leur chemin dédié (page 5 des règles). On peut tracer
                une ligne droite uniquement lorsque le point de naufrage est dans les angles rentrants de leur
                parcours (quand une ligne droite relie le point de naufrage au point de réapparition).
              </p>
            </div>
          </div>
        </section>

        {/* Social Media and Newsletter Section */}
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
