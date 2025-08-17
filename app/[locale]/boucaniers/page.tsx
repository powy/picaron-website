import Image from 'next/image'
import NewsletterSection from '@/components/NewsletterSection'

export default function BoucaniersPage() {
  return (
    <div className="mt-8">
      <h1 className="text-5xl font-oldstyle text-[#0c0c0d] mb-8 text-center">
        Boucaniers
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xl font-bold text-[#0c0c0d] mb-6">
            Jeu de stratégie en simultané. Pour 2 à 5 joueurs à partir de 10 ans et des parties de 30 à 60 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <p className="text-[#0c0c0d] text-lg leading-relaxed">
              Embarquez dans une chasse au trésor en simultané ! Voguez dans un archipel changeant truffé de cannibales, 
              de comptoirs corrompus et de mystères vaudous. Armez votre bateau, recrutez, pillez et commercez en prenant 
              garde aux Compagnies des Indes. Le dénouement n'est jamais certain et chaque tour donne le frisson !
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/boucanier3/boucaniers 3_fichiers/image001.jpg"
              alt="Boucaniers - Boîte du jeu"
              width={300}
              height={733}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <h2 className="text-4xl font-oldstyle text-[#8b2020] mb-8 text-center">Concept</h2>

        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Jouez en simultané</h3>
            <p className="text-[#0c0c0d] mb-6 text-lg">
              Pour des parties pleines de bluff et de suspense ! Choisissez votre navigation en secret puis bougez tous en même temps. 
              On n'attend pas les tours des autres !
            </p>
            <div className="mb-6">
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image002.gif"
                alt="Mécaniques de jeu simultané"
                width={605}
                height={340}
                className="rounded-lg shadow-md mx-auto"
              />
            </div>
            <p className="font-bold text-[#0c0c0d] mb-2">Mécanique fluide</p>
            <p className="text-[#0c0c0d] mb-6">
              Après la navigation, selon si des bateaux sont au contact ou à 1 de distance, il y a abordage ou tirs de canons. 
              Ensuite, tout le monde joue ses actions en même temps.
            </p>
            <Image
              src="/boucanier3/boucaniers 3_fichiers/image003.gif"
              alt="Mécanique de combat"
              width={605}
              height={340}
              className="rounded-lg shadow-md mx-auto"
            />
          </div>

          <div>
            <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Une épopée</h3>
            <p className="text-[#0c0c0d] mb-6 text-lg">Pour gagner, 2 objectifs épiques différents :</p>
            <p className="text-[#0c0c0d] mb-6">
              Déterrez le trésor caché d'Armand le baratineur avant les autres OU amassez 25 pièces d'or. 
              Le passage du Rougeaud des Compagnies des Indes au Bastion Rouge est un événement à ne pas manquer 
              car sa prise rapporte alors 15 pièces.
            </p>
            <Image
              src="/boucanier3/boucaniers 3_fichiers/image004.gif"
              alt="Objectifs du jeu"
              width={605}
              height={340}
              className="rounded-lg shadow-md mx-auto"
            />
          </div>

          <div>
            <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Profondeur de jeu</h3>
            <p className="text-[#0c0c0d] mb-6 text-lg">
              Des îles aux actions uniques, des combos infinis, des navires asymétriques. Les joueurs explorent des tactiques insolites et personnelles.
            </p>
            <Image
              src="/boucanier3/boucaniers 3_fichiers/image005.png"
              alt="Profondeur stratégique"
              width={605}
              height={340}
              className="rounded-lg shadow-md mx-auto"
            />
          </div>

          <div>
            <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Jouabilité et rejouabilité</h3>
            <p className="text-[#0c0c0d] mb-6 text-lg">
              Chaque partie est unique grâce au plateau modulable, à l'asymétrie des 10 navires et aux 24 boucaniers uniques. 
              Aussi palpitant à 2 joueurs qu'à 3, 4 ou 5, les experts comme les plus jeunes seront dans leur élément.
            </p>
            <div className="space-y-4">
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image006.gif"
                alt="Variabilité du jeu"
                width={605}
                height={340}
                className="rounded-lg shadow-md mx-auto"
              />
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image007.gif"
                alt="Adaptabilité"
                width={605}
                height={89}
                className="rounded-lg shadow-md mx-auto"
              />
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-oldstyle text-[#8b2020] mb-8 text-center mt-16">Fabrication d'excellence</h2>

        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Univers immersif</h3>
            <p className="text-[#0c0c0d] mb-6 text-lg">
              Les indices forment une frise continue. Elle permet de déterminer l'emplacement du trésor avant la partie, sur une île au hasard. 
              Ce système innovant d'indices et de caches permet à la fois la mise en place et la vérification des tentatives de fouille du trésor.
            </p>
            <div className="space-y-6">
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image008.png"
                alt="Système d'indices"
                width={605}
                height={403}
                className="rounded-lg shadow-md mx-auto"
              />
              <p className="text-[#0c0c0d]">
                Quand un joueur fouille sur une île, on vérifie si le trésor s'y trouve bien. Sinon, la partie continue.
              </p>
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image009.gif"
                alt="Mécanisme de fouille"
                width={605}
                height={340}
                className="rounded-lg shadow-md mx-auto"
              />
              <p className="text-[#0c0c0d]">
                Les indices racontent également l'histoire d'Armand le Baratineur, dont on ne peut discerner ni le début ni la fin.
              </p>
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image010.png"
                alt="Histoire d'Armand"
                width={605}
                height={403}
                className="rounded-lg shadow-md mx-auto"
              />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Gameplay recherché</h3>
            <p className="text-[#0c0c0d] mb-6">
              Affinées pendant des années, les mécaniques offrent une aventure pour tous : Un débutant pourra triompher, 
              et un expert chevronné exploitera toute la richesse stratégique.
            </p>
            <p className="text-[#0c0c0d] mb-6">
              Le jeu mêle stratégie de placement, planification sur plusieurs tours, combinaisons infinies et combos ingénieux, 
              sens du sacrifice, gestion de ressources, des combats et surtout... du BLUFF !
            </p>
            <p className="text-[#0c0c0d] mb-8">
              Ici, ce sont vos décisions, et non le hasard, qui dictent l'issue de la partie.
            </p>

            <div className="space-y-8">
              <div>
                <p className="font-bold text-[#0c0c0d] mb-4">Figurines faites maison</p>
                <p className="text-[#0c0c0d] mb-6">
                  Sculptées en réalité virtuelle et imprimées en 3D avec deux couleurs de PLA, les figurines sont entièrement réalisées par nos soins.
                </p>
                <Image
                  src="/boucanier3/boucaniers 3_fichiers/image011.gif"
                  alt="Figurines 3D"
                  width={605}
                  height={340}
                  className="rounded-lg shadow-md mx-auto"
                />
              </div>

              <div>
                <p className="font-bold text-[#0c0c0d] mb-4">Un regard documenté sur l'Histoire</p>
                <p className="text-[#0c0c0d] mb-6">
                  Apprenez-en plus sur l'Histoire de la marine et de la boucane aux Caraïbes. Le dos des fiches de bateaux porte leur description historique. 
                  Des vêtements aux gréements, des rôles d'équipage aux statuettes amérindiennes, tout est passé au peigne fin de la justesse historique.
                </p>
                <Image
                  src="/boucanier3/boucaniers 3_fichiers/image012.gif"
                  alt="Exactitude historique"
                  width={605}
                  height={340}
                  className="rounded-lg shadow-md mx-auto"
                />
              </div>

              <div>
                <p className="font-bold text-[#0c0c0d] mb-4">Des drapeaux personnalisables</p>
                <p className="text-[#0c0c0d] mb-6">
                  Les fanions de couleur seront livrés vierges. Vous pourrez dessiner sur les pavillons ou en imprimer d'autres ! 
                  Vos couleurs révéleront la vraie nature de votre témérité.
                </p>
                <Image
                  src="/boucanier3/boucaniers 3_fichiers/image013.jpg"
                  alt="Drapeaux personnalisables"
                  width={605}
                  height={340}
                  className="rounded-lg shadow-md mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-oldstyle text-[#8b2020] mb-8 text-center mt-16">Matériel</h2>
        <p className="text-[#0c0c0d] text-center mb-8 text-lg">Qu'y a-t-il dans la boîte ?</p>
        <div className="flex justify-center mb-16">
          <Image
            src="/boucanier3/boucaniers 3_fichiers/image014.jpg"
            alt="Contenu de la boîte"
            width={345}
            height={934}
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 className="text-4xl font-oldstyle text-[#8b2020] mb-8 text-center mt-16">Comment jouer ?</h2>

        <div className="space-y-8">
          <p className="text-[#0c0c0d] text-lg">
            Au début de la partie, chacun choisit un bateau et un boucanier. Grâce à la frise des indices, on détermine au hasard l'île au trésor 
            sans la révéler. Les tuiles sont placées aléatoirement pour former le plateau de jeu.
          </p>
          <p className="text-[#0c0c0d] text-lg">
            Chaque tour se divise en cinq phases que les joueurs jouent simultanément :
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Navigation</h3>
              <p className="text-[#0c0c0d] mb-6">
                En fonction de la rose des vents, choisissez votre cap et votre vitesse en secret sur vos compas. Toujours en ligne droite, 
                chaque navire ayant une vitesse maximum. Puis révélez vos compas tous en même temps. Vos navires sont ensuite déplacés comme prévu.
              </p>
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image015.gif"
                alt="Phase de navigation"
                width={605}
                height={340}
                className="rounded-lg shadow-md mx-auto"
              />
            </div>

            <div>
              <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Abordages</h3>
              <p className="text-[#0c0c0d]">
                Si des bateaux sont au même point, il y a abordage. Chaque navire perd le nombre de cartes boucaniers que son adversaire possède. 
                Celui qui doit en éliminer plus que ce qu'il possède fait naufrage.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Tirs de canons</h3>
              <p className="text-[#0c0c0d] mb-4">
                Tous les canons sont tirés simultanément sur les navires à portée de 1 segment ou au contact. Les tirs de canon enlèvent des points de 
                coque aux adversaires. Si un navire n'a plus de points de coque, il fait naufrage.
              </p>
              <p className="text-[#0c0c0d]">
                À l'abordage ou aux canons, le navire peut faire naufrage. Le joueur prendra un nouveau départ au tour suivant.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Actions</h3>
              <p className="text-[#0c0c0d] mb-4">
                Chaque navire peut faire l'action de l'île accostée, d'un boucanier ou de capitaine en dépensant une marchandise.
              </p>
              <p className="text-[#0c0c0d] mb-4">
                Chaque île offre des actions différentes : recruter un boucanier, piocher un indice, regarder un indice, réparer, améliorer son navire, 
                piller une marchandise (rhum, canne à sucre, poudre à canon), vendre des marchandises, acquérir des lettres de marque, protéger son butin, 
                ou encore sacrifier un boucanier pour gagner un fragment de carte au trésor.
              </p>
              <p className="text-[#0c0c0d]">
                On peut faire une action par tour. Les lettres de marque permettent de faire plusieurs actions dans le même tour et ainsi de réussir des combos !
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Compagnies des Indes</h3>
              <p className="text-[#0c0c0d] mb-6">
                Les navires des Compagnies des Indes voguent selon un itinéraire défini. Ils se déplacent de 1 à la fin du tour. Les couler rapporte 
                une marchandise et ils réapparaissent à l'opposé du plateau. Quand le Rougeaud passe au large du Bastion Rouge, sa prise vaut 15 pièces ! 
                Un événement à ne pas manquer si l'on cherche la victoire aux 25 !
              </p>
              <Image
                src="/boucanier3/boucaniers 3_fichiers/image016.gif"
                alt="Compagnies des Indes"
                width={605}
                height={340}
                className="rounded-lg shadow-md mx-auto"
              />
            </div>

            <div>
              <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Fouiller à la recherche du trésor</h3>
              <p className="text-[#0c0c0d] mb-4">
                Pour fouiller une île, il faut y rester 4 tours immobile. Chaque fragment acquis aux Cannibales réduit le temps de fouille d'un tour.
              </p>
              <p className="text-[#0c0c0d]">
                On utilise alors le cache de l'île et les indices mis de côté à la mise en place pour révéler si le joueur a vu juste et gagne la partie. 
                Sinon, celle-ci continue !
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Règles complètes</h3>
              <p className="text-[#0c0c0d]">
                <strong>
                  Règles disponibles ici :{' '}
                  <a 
                    href="https://archive.org/details/Boucaniers" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#8b2020] hover:underline"
                  >
                    archive.org/details/Boucaniers
                  </a>
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  )
}