import { useTranslations } from 'next-intl'
import NewsletterSection from '@/components/NewsletterSection'
import SocialLinks from '@/components/SocialLinks'
// FIXME: import BggRatingBadge from '@/components/BggRatingBadge'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const t = useTranslations('home')

  return (
    <div className="mt-8">

      {/* Announcement Banner */}
      <section className="text-center pb-4 mb-4 md:py-8 md:mb-8">
        <h1 className="heading-section">LE JEU BOUCANIERS DISPONIBLE DANS LA BOUTIQUE !</h1>
        <Link
          href="/fr/boutique"
          className="inline-block bg-forest-green hover:bg-forest-green-light text-bone font-oldstyle text-lg md:text-2xl px-6 py-3 md:px-8 md:py-4 rounded-full transition-colors duration-200 shadow-lg"
		  style={{boxShadow: "0px 30px 5px 0px rgba(0, 0, 0, 0.18)" }}
        >
          Commander
        </Link>
      </section>


      {/* Main Content Area from Front Page */}
      <div className="max-w-7xl mx-auto relative">
        {/* LAdy picture - ImageA - Top Left */}
        {/* <div className="absolute top-0 left-0 z-10">
          <Image
            src="/assets/assets_old_web/imageA.png"
            alt="Game Image A"
            width={300}
            height={200}
          />
        </div> */}

        {/* FIXME: Badge BoardGameGeek - API ne fonctionne pas correctement, à investiguer
        <div className="text-center mb-8">
          <BggRatingBadge gameId={434117} gameName="Boucaniers" />
        </div>
        */}

        {/* Game Info Banner - Above Video */}
        <div className="text-center">
          <Image
            src="/bandeau-video.png"
            alt="30 à 60 min - 2 à 5 joueurs - 10 ans et +"
            width={1280}
            height={44}
            className="mx-auto max-w-full h-auto"
            priority
          />
        </div>

        {/* YouTube Video - Center */}
        <section className="text-center mb-6 md:mb-12 relative z-20">
          <div className="mb-8 mx-auto">
            <div className="relative aspect-video rounded-lg overflow-hidden ">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/mgGl2aW1Lug"
                title="Picaron Game Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>

        </section>

        {/* Social Media Links */}
        <div className="mb-16">
          <SocialLinks />
        </div>

        {/* Main Presentation Image - Moved from Top */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="w-full">
            <Image
              src="/Présentation-KS2-transparent.png"
              alt="Présentation Boucaniers"
              width={1200}
              height={900}
              className="w-full h-auto max-w-none"
            />
          </div>
        </div>
      </div>

      {/* Boucaniers Content Starts Here */}
      <div id="boucaniers" className="max-w-4xl mx-auto mt-16">
        <div className="mb-12">
          <p className="text-ink text-lg leading-relaxed text-center mb-8">
            Embarquez dans une chasse au trésor en simultané ! Voguez dans un archipel changeant truffé de cannibales,
            de comptoirs corrompus et de mystères vaudous. Armez votre bateau, recrutez, pillez et commercez en prenant
            garde aux Compagnies des Indes. Le dénouement n'est jamais certain et chaque tour donne le frisson !
          </p>
        </div>


        <div className="space-y-12">
          <div>
            <h3 className="heading-feature">JOUEZ EN SIMULTANÉ</h3>
            <p className="text-ink mb-6 text-lg">
              Pour des parties pleines de bluff et de suspense !<br />
              Choisissez votre navigation en secret puis bougez tous en même temps.
              On n'attend pas les tours des autres !
            </p>
            <div className="mb-6">
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image002.gif"
                alt="Mécaniques de jeu simultané"
                width={605}
                height={340}
                className="rounded-lg  mx-auto"
              />
            </div>
            <p className="text-2xl font-oldstyle text-pirate-red mb-4">MÉCANIQUE FLUIDE</p>
            <p className="text-ink mb-6">
              Si des bateaux sont en contact, À L'ABORDAGE !<br />
              À un de distance? AUX CANONS !<br />
              Puis, tout le monde joue ses actions en même temps.
            </p>
            <Image
              src="/boucanier3/boucaniers 3_fichiers/image003.gif"
              alt="Mécanique de combat"
              width={605}
              height={340}
              className="rounded-lg  mx-auto"
            />
          </div>

          <div>
            <h3 className="heading-feature">UNE ÉPOPÉE À DEUX OBJECTIFS</h3>
            <p className="text-ink mb-6">
              Déterrez le trésor d'Armand le baratineur avant les autres OU amassez 25 pièces d'or.<br />
              Le passage du Rougeaud au Bastion Rouge est à ne pas manquer... sa prise rapportera alors 15 pièces.
            </p>
            <Image
              src="/boucanier3/boucaniers 3_fichiers/image004.gif"
              alt="Objectifs du jeu"
              width={605}
              height={340}
              className="rounded-lg  mx-auto"
            />
          </div>

          <div>
            <h3 className="heading-feature">PROFONDEUR DE JEU</h3>
            <p className="text-ink mb-6 text-lg">
              Des îles aux actions uniques, des combos infinis, des navires asymétriques.<br />
              Explorez des tactiques insolites et personnelles.
            </p>
            <Image
              src="/boucanier3/boucaniers 3_fichiers/image005.png"
              alt="Profondeur stratégique"
              width={605}
              height={340}
              className="rounded-lg  mx-auto"
            />
          </div>

          <div>
            <h3 className="heading-feature">JOUABILITÉ ET REJOUABILITÉ</h3>
            <p className="text-ink mb-6 text-lg">
              Chaque partie est unique grâce au plateau modulable, à l'asymétrie des 10 navires et aux 24 boucaniers uniques.
              Aussi palpitant à 2 joueurs qu'à 3, 4 ou 5, les experts comme les plus jeunes seront dans leur élément.
            </p>
            <div className="space-y-4">
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image006.gif"
                alt="Variabilité du jeu"
                width={605}
                height={340}
                className="rounded-lg  mx-auto"
              />
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image007.gif"
                alt="Adaptabilité"
                width={605}
                height={89}
                className="rounded-lg  mx-auto"
              />
            </div>
          </div>
        </div>

        <h2 className="heading-section-large">Fabrication d'excellence</h2>

        <div className="space-y-12">
          <div>
            <h3 className="heading-feature">UNIVERS IMMERSIF</h3>
            <p className="text-ink mb-6 text-lg">
              Les indices forment une frise continue.<br />
              Elle permet de placer le trésor sur une île au hasard avant la partie.<br />
              Un système innovant fait d'indices et de caches pour la mise en place et la vérification des tentatives de fouille du trésor.
            </p>
            <div className="space-y-6">
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image008.png"
                alt="Système d'indices"
                width={605}
                height={403}
                className="rounded-lg  mx-auto"
              />
              <p className="text-ink">
                Quand un joueur fouille sur une île, on vérifie si le trésor s'y trouve bien. Sinon, la partie continue.
              </p>
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image009.gif"
                alt="Mécanisme de fouille"
                width={605}
                height={340}
                className="rounded-lg  mx-auto"
              />
              <p className="text-ink">
                Les indices racontent également l'histoire d'Armand le Baratineur, dont on ne peut discerner ni le début ni la fin.
              </p>
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image010.png"
                alt="Histoire d'Armand"
                width={605}
                height={403}
                className="rounded-lg  mx-auto"
              />
            </div>
          </div>

          <div>
            <h3 className="heading-feature">GAMEPLAY SOPHISTIQUÉ</h3>
            <p className="text-ink mb-6">
              Affinées pendant des années, les mécaniques offrent une aventure pour tous : Un débutant pourra triompher,
              et un expert chevronné exploitera toute la richesse stratégique.
            </p>
            <p className="text-ink mb-6">
              Le jeu mêle stratégie de placement, planification sur plusieurs tours, combinaisons infinies et combos ingénieux,
              sens du sacrifice, gestion de ressources, des combats et surtout... du BLUFF!
            </p>
            <p className="text-ink mb-8">
              Ici, ce sont vos décisions, et non le hasard, qui dictent l'issue de la partie.
            </p>

            <div className="space-y-8">
              <div>
                <p className="text-2xl font-oldstyle text-pirate-red mb-4">FIGURINES FAITES MAISON</p>
                <p className="text-ink mb-6">
                  Sculptées en réalité virtuelle et imprimées en 3D avec en PLA, les figurines sont entièrement réalisées dans notre atelier.
                </p>
                <Image
                  src="/boucanier3/boucaniers 3_fichiers/image011.gif"
                  alt="Figurines 3D"
                  width={605}
                  height={340}
                  className="rounded-lg  mx-auto"
                />
              </div>

              <div>
                <p className="text-2xl font-oldstyle text-pirate-red mb-4">FIDÉLITÉ HISTORIQUE</p>
                <p className="text-ink mb-6">
                  Apprenez-en plus sur l'Histoire de la marine et de la boucane aux Caraïbes.<br/>
	              Les bateaux portent leur description historique sur leurs fiches. Des vêtements aux gréements, des rôles d'équipage aux statuettes amérindiennes, tout est documenté.
                </p>
                <Image
                  src="/boucanier3/boucaniers 3_fichiers/image012.gif"
                  alt="Exactitude historique"
                  width={605}
                  height={340}
                  className="rounded-lg  mx-auto"
                />
              </div>

              <div>
                <p className="text-2xl font-oldstyle text-pirate-red mb-4">DRAPEAUX PERSONNALISABLES</p>
                <p className="text-ink mb-6">
                  Les fanions de couleur seront livrés vierges.<br/>
	              Vous pourrez dessiner sur les pavillons ou en imprimer d'autres ! <br />
                  Vos couleurs révéleront la vraie nature de votre témérité.
                </p>
                <Image
                  src="/boucanier3/boucaniers 3_fichiers/image013.jpg"
                  alt="Drapeaux personnalisables"
                  width={605}
                  height={340}
                  className="rounded-lg  mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <h2 className="heading-section-large">Matériel</h2>
        <p className="text-ink text-center mb-8 text-lg">Qu'y a-t-il dans la boîte ?</p>
        <div className="w-full mb-16">
          <Image
            src="/MatérielTransparent.png"
            alt="Contenu de la boîte"
            width={800}
            height={600}
            className="w-full h-auto"
          />
        </div>

        <h2 className="heading-section-large">Comment jouer ?</h2>

        <div className="space-y-8">
          <p className="text-ink text-lg">
            Au début de la partie, chacun choisit un bateau et un boucanier. Grâce à la frise des indices, on détermine au hasard l'île au trésor
            sans la révéler. Les tuiles sont placées aléatoirement pour former le plateau de jeu.
          </p>
          <p className="text-ink text-lg">
            Chaque tour se divise en cinq phases que les joueurs jouent simultanément :
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="heading-feature">Navigation</h3>
              <p className="text-ink mb-6">
                En fonction de la rose des vents, choisissez votre cap et votre vitesse en secret sur vos compas. Toujours en ligne droite,
                chaque navire ayant une vitesse maximum. Puis révélez vos compas tous en même temps. Vos navires sont ensuite déplacés comme prévu.
              </p>
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image015.gif"
                alt="Phase de navigation"
                width={605}
                height={340}
                className="rounded-lg  mx-auto"
              />
            </div>

            <div>
              <h3 className="heading-feature">Abordages</h3>
              <p className="text-ink">
                Si des bateaux sont au même point, il y a abordage. Chaque navire perd le nombre de cartes boucaniers que son adversaire possède.
                Celui qui doit en éliminer plus que ce qu'il possède fait naufrage.
              </p>
            </div>

            <div>
              <h3 className="heading-feature">Tirs de canons</h3>
              <p className="text-ink mb-4">
                Tous les canons sont tirés simultanément sur les navires à portée de 1 segment ou au contact. Les tirs de canon enlèvent des points de
                coque aux adversaires. Si un navire n'a plus de points de coque, il fait naufrage.
              </p>
              <p className="text-ink">
                À l'abordage ou aux canons, le navire peut faire naufrage. Le joueur prendra un nouveau départ à la fin du tour suivant.
              </p>
            </div>

            <div>
              <h3 className="heading-feature">Actions</h3>
              <p className="text-ink mb-4">
                Chaque navire peut faire l'action de l'île accostée, d'un boucanier ou de capitaine en dépensant une marchandise.
              </p>
              <p className="text-ink mb-4">
                Chaque île offre des actions différentes : recruter un boucanier, piocher un indice, regarder un indice, réparer, améliorer son navire,
                piller une marchandise (rhum, canne à sucre, poudre à canon), vendre des marchandises, acquérir des lettres de marque, protéger son butin,
                ou encore sacrifier un boucanier pour gagner un fragment de carte au trésor.
              </p>
              <p className="text-ink">
                On peut faire une action par tour. Les lettres de marque permettent de faire plusieurs actions dans le même tour et ainsi de réussir des combos !
              </p>
            </div>

            <div>
              <h3 className="heading-feature">Compagnies des Indes</h3>
              <p className="text-ink mb-6">
                Les navires des Compagnies des Indes voguent selon un itinéraire défini. Ils se déplacent de 1 à la fin du tour. Les couler rapporte
                une marchandise et ils réapparaissent à l'opposé du plateau. Quand le Rougeaud passe au large du Bastion Rouge, sa prise vaut 15 pièces !
                Un événement à ne pas manquer si l'on cherche la victoire aux 25 !
              </p>
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image016.gif"
                alt="Compagnies des Indes"
                width={605}
                height={340}
                className="rounded-lg  mx-auto"
              />
            </div>

            <div>
              <h3 className="heading-feature">Fouiller à la recherche du trésor</h3>
              <p className="text-ink mb-4">
                Pour fouiller une île, il faut y rester 4 tours immobile. Chaque fragment acquis aux Cannibales réduit le temps de fouille d'un tour.
              </p>
              <p className="text-ink">
                On utilise alors le cache de l'île et les indices mis de côté à la mise en place pour révéler si le joueur a vu juste et gagne la partie.
                Sinon, celle-ci continue !
              </p>
            </div>

            <div>
              <h3 className="heading-feature">Règles complètes</h3>
              <p className="text-ink">
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

        {/* Second Social Media and Newsletter Section */}
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
