import { useTranslations } from 'next-intl'
import NewsletterSection from '@/components/NewsletterSection'
import SocialLinks from '@/components/SocialLinks'
import Image from 'next/image'
import Link from 'next/link'

export default function CommentJouerPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="title-page">Comment jouer ?</h1>

        <div className="my-8 w-full max-w-4xl mx-auto">
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
              src="https://www.youtube.com/embed/K2zVEDCRtc8"
              title="Comment jouer à Boucaniers - Tutoriel vidéo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="space-y-8">
          <p className="text-body-on-light">
            Au début de la partie, chacun choisit un bateau et un boucanier. Grâce à la frise des indices, on détermine au hasard l'île au trésor
            sans la révéler. Les tuiles sont placées aléatoirement pour former le plateau de jeu.
          </p>
          <p className="text-body-on-light">
            Chaque tour se divise en cinq phases que les joueurs jouent simultanément :
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="heading-section-on-light">Navigation</h3>
              <p className="text-body-on-light mb-6">
                En fonction de la rose des vents, choisissez votre cap et votre vitesse en secret sur vos compas. Toujours en ligne droite,
                chaque navire ayant une vitesse maximum. Puis révélez vos compas tous en même temps. Vos navires sont ensuite déplacés comme prévu.
              </p>
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image015.gif"
                alt="Phase de navigation"
                width={605}
                height={340}
                className="mx-auto"
              />
            </div>

            <div>
              <h3 className="heading-section-on-light">Abordages</h3>
              <p className="text-body-on-light">
                Si des bateaux sont au même point, il y a abordage. Chaque navire perd le nombre de cartes boucaniers que son adversaire possède.
                Celui qui doit en éliminer plus que ce qu'il possède fait naufrage.
              </p>
            </div>

            <div>
              <h3 className="heading-section-on-light">Tirs de canons</h3>
              <p className="text-body-on-light mb-4">
                Tous les canons sont tirés simultanément sur les navires à portée de 1 segment ou au contact. Les tirs de canon enlèvent des points de
                coque aux adversaires. Si un navire n'a plus de points de coque, il fait naufrage.
              </p>
              <p className="text-body-on-light">
                À l'abordage ou aux canons, le navire peut faire naufrage. Le joueur prendra un nouveau départ à la fin du tour suivant.
              </p>
            </div>

            <div>
              <h3 className="heading-section-on-light">Actions</h3>
              <p className="text-body-on-light mb-4">
                Chaque navire peut faire l'action de l'île accostée, d'un boucanier ou de capitaine en dépensant une marchandise.
              </p>
              <p className="text-body-on-light mb-4">
                Chaque île offre des actions différentes : recruter un boucanier, piocher un indice, regarder un indice, réparer, améliorer son navire,
                piller une marchandise (rhum, canne à sucre, poudre à canon), vendre des marchandises, acquérir des lettres de marque, protéger son butin,
                ou encore sacrifier un boucanier pour gagner un fragment de carte au trésor.
              </p>
              <p className="text-body-on-light">
                On peut faire une action par tour. Les lettres de marque permettent de faire plusieurs actions dans le même tour et ainsi de réussir des combos !
              </p>
            </div>

            <div>
              <h3 className="heading-section-on-light">Compagnies des Indes</h3>
              <p className="text-body-on-light mb-6">
                Les navires des Compagnies des Indes voguent selon un itinéraire défini. Ils se déplacent de 1 à la fin du tour. Les couler rapporte
                une marchandise et ils réapparaissent à l'opposé du plateau. Quand le Rougeaud passe au large du Bastion Rouge, sa prise vaut 15 pièces !
                Un événement à ne pas manquer si l'on cherche la victoire aux 25 !
              </p>
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image016.gif"
                alt="Compagnies des Indes"
                width={605}
                height={340}
                className="mx-auto"
              />
            </div>

            <div>
              <h3 className="heading-section-on-light">Fouiller à la recherche du trésor</h3>
              <p className="text-body-on-light mb-4">
                Pour fouiller une île, il faut y rester 4 tours immobile. Chaque fragment acquis aux Cannibales réduit le temps de fouille d'un tour.
              </p>
              <p className="text-body-on-light">
                On utilise alors le cache de l'île et les indices mis de côté à la mise en place pour révéler si le joueur a vu juste et gagne la partie.
                Sinon, celle-ci continue !
              </p>
            </div>

            <div>
              <h3 className="heading-section-on-light">Règles complètes</h3>
              <p className="text-body-on-light">
                <strong>
                  Règles disponibles ici :{' '}
                  <a
                    href="https://archive.org/details/Boucaniers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pirate-red hover:underline"
                  >
                    archive.org/details/Boucaniers
                  </a>
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="text-center mb-8">
          <Link
            href="/fr/boutique"
            className="btn-primary-rounded"
            style={{boxShadow: "0px 30px 5px 0px rgba(0, 0, 0, 0.18)" }}
          >
            Commander
          </Link>
        </div>

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
  )
}
