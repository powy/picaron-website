import { useTranslations } from 'next-intl'
import NewsletterSection from '@/components/NewsletterSection'
import CardCarousel from '@/components/CardCarousel'
import SocialLinks from '@/components/SocialLinks'
import BggRatingBadge from '@/components/BggRatingBadge'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const t = useTranslations('home')

  return (
    <div className="relative mt-8">

      {/* Monkey GIF - positioned from page top to bottom */}
      <div className="absolute top-0 right-0 bottom-0 w-full pointer-events-none hidden md:block z-0">
        <div className="max-w-6xl mx-auto px-4 h-full relative">
          <Image
            src="/assets-presentation/0_Singe_rallongé_petit.gif"
            alt=""
            width={800}
            height={905}
            className="absolute top-0 right-4 h-auto w-[400px] max-w-[40%] md:max-w-[50%] object-contain object-right-top"
            unoptimized={true}
            aria-hidden="true"
            style={{ maxHeight: '100%' }}
          />
        </div>
      </div>

      {/* Content wrapper - foreground layer */}
      <div className="relative z-10">

        {/* Title section */}
        <section className="text-center pb-4 mb-4 md:py-8 md:mb-8">
        <Link href="/fr/boutique" className="block mb-4 md:mb-6">
          <h1 className="title-page">
            Le jeu Boucaniers disponible !
          </h1>
        </Link>
        <Link
          href="/fr/boutique"
          className="btn-primary-rounded"
      style={{boxShadow: "0px 30px 5px 0px rgba(0, 0, 0, 0.18)" }}
        >
          Commander
        </Link>
      </section>

        {/* BoardGameGeek rating */}
        <div className="flex justify-center mb-2">
          <BggRatingBadge />
        </div>

        {/* Banner and video sections  */}
        <div className="max-w-6xl mx-auto px-4">

        {/* Game Info Banner - Above Video */}
        <div className="text-center relative z-10 mb-0">
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
          <div className="mb-8 mx-auto w-full">
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
        <div className="max-w-full mx-auto mb-16">
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

      </div> {/* End content wrapper (foreground layer) */}

      {/* Boucaniers Content Starts Here */}
      <div id="boucaniers" className="mt-16">
        {/* Intro paragraph - centered narrow column */}
        <div className="max-w-6xl mx-auto px-4 mb-12">
          <p className="text-body-on-light text-center mb-8">
            Embarquez dans une chasse au trésor en simultané ! Voguez dans un archipel changeant truffé de cannibales,
            de comptoirs corrompus et de mystères vaudous. Armez votre bateau, recrutez, pillez et commercez en prenant
            garde aux Compagnies des Indes. Le dénouement n'est jamais certain et chaque tour donne le frisson !
          </p>
        </div>

        {/* Full-width background sections */}
        <div className="space-y-12">
          {/* Example of -on-dark variant for dark backgrounds */}
          {/* JOUEZ EN SIMULTANÉ Section with Red Overlay */}
          <div className="relative w-full min-h-[1200px] md:min-h-[1100px] lg:min-h-[1500px]">
            {/* Red overlay */}
            <div
              className="absolute inset-0 pointer-events-none bg-center bg-no-repeat opacity-100 z-0 [background-size:auto_100%] md:[background-size:100%_100%]"
              style={{
                backgroundImage: 'url(/Tache-rouge-avec-texture.png)',
              }}
            />

            {/* Vertically centered content container */}
            <div className="relative z-10 flex items-center min-h-[1200px] md:min-h-[1100px] lg:min-h-[1500px]">
              <div className="mx-auto px-4 py-24 md:py-10 w-full">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">

                  {/* Left: Text */}
                  <div className="text-section-on-dark">
                    <h3 className="heading-section-on-dark">JOUEZ EN<br/> SIMULTANÉ</h3>
                    <p className="text-body-on-dark mb-6">
                      Pour des parties pleines de <span className="text-highlight-on-dark">BLUFF</span><br/> et de <span className="text-highlight-on-dark">SUSPENSE</span> !</p>
                    <p className="text-body-on-dark mb-6">
                      Choisissez votre navigation en secret<br/> puis bougez tous en même temps.<br/>
                      On n'attend pas le tour des autres !
                    </p>
                  </div>

                  {/* Right: video */}
                  <div className="video-section-on-dark">
                    <video
                      className="w-full h-auto"
                      width={605}
                      height={340}
					  autoPlay
					  muted
					  loop
					  playsInline
					>  
					  <source
					  src="/boucanier3/boucaniers 3_fichiers/1_Jouez_en_simultane.webm"
                    />
					</video>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* MÉCANIQUE FLUIDE Section */}
          <div className="relative w-full min-h-[250px] md:min-h-[250px] lg:min-h-[250px]">


            {/* Vertically centered content container */}
            <div className="relative z-10 flex items-center min-h-[250px] md:min-h-[250px] lg:min-h-[250px]">
              <div className="mx-auto px-4 py-0 w-full">
                
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">



                  {/* Left: video */}
                  <div className="video-section-on-dark">
                    <video
                      className="w-full h-auto"
                      width={605}
                      height={340}
					  autoPlay
					  muted
					  loop
					  playsInline
					>  
					  <source
					  src="/boucanier3/boucaniers 3_fichiers/2_Mecanique fluide.webm"
                    />
					</video>
                  </div>

                  {/* Right: Text */}
                  <div className="text-section-on-light">
                    <h3 className="heading-section-on-light">MÉCANIQUE FLUIDE</h3>
                    <p className="text-body-on-light mb-6">
                      Si des bateaux sont en contact,<br />
                      <span className="text-highlight-on-light">À L'ABORDAGE !</span><br />
                      À un de distance ? <span className="text-highlight-on-light">AUX CANONS !</span><br />
                      Puis, tout le monde joue ses actions en même temps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="relative w-full min-h-[1100px] md:min-h-[1000px] lg:min-h-[1500px]">
   
              <div
              className="absolute inset-0 pointer-events-none bg-center bg-no-repeat opacity-100 z-0 [background-size:auto_100%] md:[background-size:100%_100%]"
              style={{
                backgroundImage: 'url(/3-Fond-bleu-avec-texture2.png)',
              }}
            /> 

            {/* Vertically centered content container */}
            <div className="relative z-10 flex items-center min-h-[1100px] md:min-h-[1000px] lg:min-h-[1500px]">
              <div className="mx-auto px-4 py-24 md:py-20 w-full">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">

                  {/* Left: Text */}
                  <div className="text-section-on-dark">
                    <h3 className="heading-section-on-dark">UNE ÉPOPÉE À 2 OBJECTIFS</h3>
                    <p className="text-body-on-dark mb-6">
                      Déterrez le <span className="text-highlight-on-dark">trésor</span> d'Armand<br />  avant les autres<br /> <span className="text-highlight-on-dark">ou</span> amassez 25 <span className="text-highlight-on-dark">pièces</span>.</p>
                    <p className="text-body-on-dark mb-6">
                      Le passage du Rougeaud au Bastion Rouge<br/> est à ne pas manquer... sa prise rapporte alors 15 pièces.
                    </p>
                  </div>

                  {/* Right: video */}
                  <div className="video-section-on-dark">
                    <video
                      className="w-full h-auto"
                      width={605}
                      height={340}
					  autoPlay
					  muted
					  loop
					  playsInline
					>  
					  <source
					  src="/boucanier3/boucaniers 3_fichiers/3_Une_epopee_a_deux_objectifs.webm"
                    />
					</video>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* PROFONDEUR DE JEU */}
          <div className="relative w-full min-h-[600px] md:min-h-[500px] lg:min-h-[400px]">


            {/* Vertically centered content container */}
            <div className="relative z-10 flex items-center min-h-[600px] md:min-h-[500px] lg:min-h-[400px]">
              <div className="mx-auto px-4 py-0 w-full">
                {/* Grid: 2 columns on mobile, 3 proportional columns on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_0.75fr] gap-2 md:gap-4 lg:gap-4 items-center">

                  {/* Column 1: Existing left image - spans 2 cols on mobile, 1 on desktop */}
                   <div className="w-full col-span-2 md:col-span-1">
                    <video
                      className="w-full h-auto"
                      width={605}
                      height={340}
					  autoPlay
					  muted
					  loop
					  playsInline
					>  
					  <source
					  src="/boucanier3/boucaniers 3_fichiers/4_Profondeur_de_jeu.mp4"
                    />
					</video>
                  </div>

                  {/* Column 2: Text content - 1 col on mobile, 1 on desktop */}
                  <div className="w-full space-y-6">
                    <h3 className="heading-section-on-light">PROFONDEUR DE JEU</h3>
                    <p className="text-body-on-light mb-6">
                      Des îles aux actions <span className="text-highlight-on-light">uniques</span>, des <span className="text-highlight-on-light">combos</span> infinis, des navires <span className="text-highlight-on-light">asymétRiques</span>.<br />
                      Explorez des tactiques insolites et personnelles.
                    </p>
                  </div>

                  {/* Column 3: New sea wolf image (right) - 1 col on mobile, 1.5fr on desktop */}
                  <div className="w-full">
                    <Image
                      src="/assets-presentation/4_Vieux_Loup_de_mer_transparent_petit.gif"
                      alt="Vieux loup de mer"
                      width={700}
                      height={816}
                      className="w-full h-auto"
                      unoptimized={true}
                    />
                  </div>

                  {/* Bottom row: Player count banner - spans 2 cols on mobile, 3 on desktop */}
                  <div className="col-span-2 md:col-span-3 w-full flex justify-center mt-4 md:mt-0">
                    <Image
                      src="/assets-presentation/4_nombre_de_joueurs.gif"
                      alt="Nombre de joueurs"
                      width={640}
                      height={94}
                      className="w-full h-auto max-w-3xl"
                      unoptimized={true}
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div> {/* End space-y-12 for full-width sections */}

        <div className="space-y-12">
          {/* JOUABILITÉ ET REJOUABILITÉ Section with Red Overlay */}
          <div className="relative w-full min-h-[1500px] md:min-h-[850px] lg:min-h-[1500px]">
            {/* Try 5: Red ink stain overlay - Like Try 1 but less transparent */}
            <div
              className="absolute inset-0 pointer-events-none bg-center bg-no-repeat opacity-100 z-0 [background-size:auto_100%] md:[background-size:100%_100%]"
              style={{
                backgroundImage: 'url(/Tache-rouge-avec-texture.png)',
              }}
            />

            {/* Vertically centered content container */}
            <div className="relative z-10 flex items-center min-h-[1500px] md:min-h-[850px] lg:min-h-[1500px]">
              <div className="mx-auto px-4 py-24 md:py-20 w-full">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">

                  {/* Left: Text */}
                  <div className="w-full md:w-[50%] space-y-6 text-right">
                    <h3 className="heading-section-on-dark">JOUABILITÉ ET REJOUABILITÉ</h3>
                    <p className="text-body-on-dark mb-6">
                      Chaque partie est unique grâce au <span className="text-highlight-on-dark">plateau modulable</span>, à l'asymétrie des 10 navires et aux 24 boucaniers uniques.<br />
                      Aussi palpitant à 2 joueurs qu'à 3, 4 ou 5, les <span className="text-highlight-on-dark">expeRts</span> comme les <span className="text-highlight-on-dark">plus jeunes</span> seront dans leur élément.
                    </p>
                  </div>

                  {/* Right: Two Images Stacked */}
                  <div className="w-full md:w-[50%]">
                    <Image
                      src="/boucanier3/boucaniers 3_fichiers/5-rejouabilite.gif"
                      alt="Variabilité du jeu"
                      width={605}
                      height={340}
                      className="w-full h-auto"
                    />
                 
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div> {/* End space-y-12 wrapper */}

        <h2 className="title-section">Fabrication d'excellence</h2>

        <div className="space-y-4">
          {/* UNIVERS IMMERSIF - Section 1: Les indices forment une frise continue */}
          <div className="relative w-full min-h-[300px] md:min-h-[300px] lg:min-h-[300px]">


            {/* Vertically centered content container */}
            <div className="relative z-10 flex items-center min-h-[300px] md:min-h-[300px] lg:min-h-[300px]">
              <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 w-full">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                  <h3 className="heading-section-on-light">UNIVERS IMMERSIF</h3>
                  <p className="text-body-on-light mb-6">
                    Les indices forment une frise continue. Elle permet de cacher le trésor sur une île au hasard avant la partie. <br />
					Un système innovant fait d'indices et de caches pour la mise en place et la vérification des tentatives de fouille du trésor.
                  </p>
                </div>
              </div>
            </div>
          </div>

                    {/* Card Carousel Animation */}
          
            <CardCarousel />
          

          {/* UNIVERS IMMERSIF - Section 2: Quand un joueur fouille */}
  <div className="relative w-full min-h-[250px] md:min-h-[250px] lg:min-h-[250px]">


            {/* Vertically centered content container */}
            <div className="relative z-10 flex items-center min-h-[250px] md:min-h-[250px] lg:min-h-[250px]">
              <div className="max-w-7xl mx-auto px-4 py-24 md:py-20 w-full">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
                  <div className="w-full md:w-1/2">
                    <p className="text-body-on-light">
                      Quand un joueur fouille sur une île, on vérifie si le trésor s'y trouve bien. <br /> <br />Sinon, la partie continue.
                    </p>
                  </div>

                  <div className="w-full md:w-1/2">
                    <Image
                      src="/boucanier3/boucaniers 3_fichiers/7-Indices-ile superposes.gif"
                      alt="Mécanisme de fouille"
                      width={605}
                      height={340}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* UNIVERS IMMERSIF - Section 2: Blue brushstroke banner with Armand text */}
          <div className="relative w-full max-w-4xl mx-auto min-h-[500px] md:min-h-[300px] lg:min-h-[500px] justify-center">
            {/* Blue brushstroke background */}
            <div
              className="absolute inset-0 pointer-events-none bg-center bg-no-repeat opacity-100 z-0 [background-size:auto_100%] md:[background-size:100%_100%]"
              style={{
                backgroundImage: 'url(/8-a-CORRECTED-Petite-Tache-TEXTUREE.png',
              }}
            />

            {/* Vertically centered content container */}
            <div className="relative z-10 flex items-center justify-center min-h-[500px] md:min-h-[300px] lg:min-h-[500px]">
              <div className="px-8 pt-20 md:pt-16 w-full max-w-2xl text-center">
                 
                <p className="text-body-on-dark mb-6">
                  Les péripéties d'Armand se cachent dans les indices.
                  Ce que renferme le trésor est raconté dans la
                   nouvelle illustrée <span className="text-cite-on-dark">Armand ou Les Réveurs du Nouveau Monde.</span>
                </p>
              </div>
            </div>
          </div>




          {/* UNIVERS IMMERSIF - Section 3: Histoire d'Armand avec les Récits du Nouveau Monde */}
          <div className="relative w-full">

            {/* Content container with top alignment */}
            <div className="relative z-10 flex items-start w-full">
              <div className="max-w-5xl mx-auto px-4 w-full">

                {/* Vertical stack of all elements */}
                <div className="flex flex-col items-center gap-4 md:gap-6">

                  {/* 2. Three episodes illustration */}
                  <div className="w-full max-w-4xl">
                    <Image
                      src="/assets-presentation/8 Episodes-d_Armand.png"
                      alt="Épisodes d'Armand le Baratineur"
                      width={1200}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* 3. Book illustration with Commander button beside it */}
                  <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                    {/* Book image */}
                    <div className="w-full md:w-auto">
                      <Image
                        src="/assets-presentation/8-Nouvelle-illustrée-intérieur.png"
                        alt="Nouvelle illustrée - Les Récits du Nouveau Monde"
                        width={1200}
                        height={800}
                        className="w-full md:w-auto md:max-w-lg h-auto"
                      />
                    </div>

                    {/* Commander button next to book */}
                    <div>
                      <Link
                        href="/fr/boutique"
                        className="btn-primary-rounded"
                        style={{boxShadow: "0px 30px 5px 0px rgba(0, 0, 0, 0.18)" }}
                      >
                        Commander
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* GAMEPLAY SOPHISTIQUÉ  */}
                  <div className="space-y-12">

          <div className="relative w-full min-h-[1200px] md:min-h-[950px] lg:min-h-[1500px]">

            <div
              className="absolute inset-0 pointer-events-none bg-center bg-no-repeat opacity-100 z-0 [background-size:cover] md:[background-size:100%_100%]"
              style={{
                backgroundImage: 'url(/Tache-rouge-avec-texture.png)',
              }}
            />

            {/* Vertically almost-on-top (3% padding on top) content container */}
            <div className="relative z-10 flex items-center min-h-[1200px] md:min-h-[950px] lg:min-h-[1500px]">
              <div className="mx-auto px-4 pt-24 md:py-20 w-full">
                <div className="space-y-6 pt-50 mx-auto ">
                    {/* Grid: 2 columns for text+ image on right. TODO: center the thing, currently i had to add an extra 3rd column to have an aliignment, it's bad.*/}
                    <div className="grid grid-cols-[1fr_0.5fr] md:grid-cols-[1fr_0.25fr_0.25fr] gap-2 md:gap-4 lg:gap-4 items-center ">
                        <h3 className="heading-section-on-dark text-right self-end">GAMEPLAY SOPHISTIQUÉ</h3>
                        <Image
                          src="/boucanier3/boucaniers 3_fichiers/9-zephyr.png"
                          alt="Mécanisme de fouille"
                          width={605}
                          height={340}
                          className="w-full h-auto"
                        />
                    </div>
                    {/* Grid: 3 column for tex t+ image on each side TODO: in mobile, put both icon on an extra row on top*/}
                    <div className="grid grid-cols-[0.5fr_1fr] md:grid-cols-[0.25fr_1fr_0.25fr] gap-2 md:gap-4 lg:gap-4 items-center">
                        <Image
                          src="/boucanier3/boucaniers 3_fichiers/9-poseidon.png"
                          alt="Mécanisme de fouille"
                          width={605}
                          height={340}
                          className="w-full h-auto"
                        />
                        <p className="text-body-on-dark mb-6">
                        Le jeu mêle stratégie de placement, planification sur plusieurs tours, combinaisons infinies et combos ingénieux, sens du sacrifice, gestion de ressources, des combats et surtout... du <span className="text-highlight-on-dark">BLUFF</span> !
                        </p>
                        <Image
                          src="/boucanier3/boucaniers 3_fichiers/9-Petit-bateau-droite.png"
                          alt="Mécanisme de fouille"
                          width={605}
                          height={340}
                          className="hidden md:block w-full h-auto"
                        />
                      <div/>
                    </div>
					<div className="flex justify-center">
					  <Link
						href="/fr/boucaniers/comment-jouer"
						className="btn-primary-blue-rounded"
						style={{boxShadow: "0px 30px 5px 0px rgba(0, 0, 0, 0.18)" }}
					  >
						Comment jouer
					  </Link>
                    </div>
                    {/* Grid: 2 column for text+ image on left*/}
                    <div className="grid grid-cols-[1fr_0.25fr] md:grid-cols-[0.25fr_0.25fr_1fr] gap-2 md:gap-4 lg:gap-4 items-center">
				      <div className="hidden md:block" />
                      <Image
                          src="/boucanier3/boucaniers 3_fichiers/9-Petit-bateau-gauche.png"
                          alt="Mécanisme de fouille"
                          width={605}
                          height={340}
                          className="hidden md:block w-full h-auto"
                      />
                      <p className="text-body-on-dark mb-6">
                        Ici, ce sont vos décisions, <span className="text-highlight-on-dark">et non le hasaRd</span>, <br />qui dictent l'issue de la partie.
                      </p>
                      <Image
                          src="/boucanier3/boucaniers 3_fichiers/9-Petit-bateau-gauche.png"
                          alt="Mécanisme de fouille"
                          width={605}
                          height={340}
                          className="md:hidden w-full h-auto"
                      />
                    </div>
                </div>
              </div>
            </div>
          </div>
                    </div>

          {/*  FIGURINES FAITES MAISON */}
          <div className="relative w-full min-h-[600px] md:min-h-[500px] lg:min-h-[400px]">


            {/* Vertically centered content container */}
            <div className="relative z-10 flex items-center min-h-[600px] md:min-h-[500px] lg:min-h-[400px]">
              <div className=" mx-auto px-4 py-12 md:py-20 w-full">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">



                  {/* Left: video */}
                  <div className="video-section-on-dark">
                    <video
                      className="w-full h-auto"
                      width={605}
                      height={340}
					  autoPlay
					  muted
					  loop
					  playsInline
					>  
					  <source
					  src="/boucanier3/boucaniers 3_fichiers/10_Figurines_faites_maison_Petit.webm"
                    />
					</video>
                  </div>

                  {/* Right: Text */}
                  <div className="w-full md:w-1/2 space-y-6">
                    <p className="heading-section-on-light">FIGURINES FAITES MAISON</p>
                     <p className="text-body-on-light mb-6">
                      Sculptées en réalité virtuelle et imprimées en 3D en PLA, 
                      les figurines sont entièrement réalisées dans notre atelier.
                    </p>
                    <p className="text-body-on-light mb-6">
                      Une fabrication unique dans le monde du jeu 
                      permetant d'obtenir des <span className="text-highlight-on-light">figurines multicolores</span>
                    </p>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*   FIDÉLITÉ HISTORIQUE */}
          <div className="relative w-full min-h-[1250px] md:min-h-[500px] lg:min-h-[1500px]">
            {/* Red texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none bg-right bg-no-repeat opacity-100 z-0 [background-size:190%_100%] md:[background-size:100%_125%] lg:[background-size:125%_125%] translate-y-[0%] md:translate-y-[-10%] lg:translate-y-[-22%]"
              style={{
                backgroundImage: 'url(/11-Tache-d_encre-bleue-TEXTURÉE.png)',
              }}
            />
			

            {/* Vertically centered content container */}
            <div className="relative z-10 flex items-center min-h-[1250px] md:min-h-[1200px] lg:min-h-[1000px]">
              <div className="mx-auto px-4 py-24 md:py-20 w-full">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
                  <div className="w-full md:w-1/2">
                    <video
                      className="w-full h-auto"
                      width={605}
                      height={340}
					  autoPlay
					  muted
					  loop
					  playsInline
					>  
					  <source
					  src="/boucanier3/boucaniers 3_fichiers/7_Fidelite_historique.webm"
                    />
					</video>
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                    <p className="heading-section-on-dark">FIDÉLITÉ HISTORIQUE</p>
                    <p className="text-body-on-dark mb-6">
                      Apprenez-en plus sur l'Histoire de la marine et de la boucane aux <span className="text-highlight-on-dark">CaRaïbes.</span></p>
                    
                    <p className="text-body-on-dark mb-6">
                      Les bateaux portent leur description historique sur leurs fiches. 
                    </p>
                    <p className="text-body-on-dark mb-6">
                      Des vêtements aux gréements, des rôles d'équipage aux statuettes amérindiennes, <span className="text-highlight-on-dark">tout est documenté</span>.
                    </p>

                  </div>
                </div>
              </div>
            </div>
          </div>




          {/*  DRAPEAUX PERSONNALISABLES */}
          <div className="relative w-full min-h-[250px] md:min-h-[250px] lg:min-h-[250px]">


            {/* Vertically centered content container */}
            <div className="relative z-10 pb-14 flex items-center min-h-[250px] md:min-h-[250px] lg:min-h-[250px]">
              <div className="max-w-7xl mx-auto px-4 py-0 w-full">
                
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">



                  {/* Left: Image */}
                  <div className="w-full md:w-1/2">
                    <Image
                      src="/boucanier3/boucaniers 3_fichiers/12-Drapeaux personnalisables.jpg"
                      alt="Drapeaux personnalisables"
                      width={605}
                      height={340}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Right: Text */}
                         <div className="w-full md:w-1/2 space-y-6">
                    <p className="heading-section-on-light">DRAPEAUX PERSONNALISABLES</p>
                    <p className="text-body-on-light mb-6">
                      Les fanions de couleur seront livrés vierges. Vous pourrez <span className="text-highlight-on-light">dessiner</span> sur les pavillons ou en imprimer d'autres !
                      
                    </p>
                    <p className="text-body-on-light mb-6">
 Vos couleurs révéleront la vraie nature de votre témérité.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        <h2 className="title-section">Matériel</h2>
        <p className="text-body-on-light text-center mb-8">Qu'y a-t-il dans la boîte ?</p>
        <div className="w-full mb-16 max-w-2xl mx-auto">
          <Image
            src="/MatérielTransparent.png"
            alt="Contenu de la boîte"
            width={800}
            height={600}
            className="w-full h-auto"
          />
        </div>

        {/* Call to Action Buttons */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/fr/boutique"
              className="btn-primary-rounded"
              style={{boxShadow: "0px 30px 5px 0px rgba(0, 0, 0, 0.18)" }}
            >
              Commander
            </Link>
            <Link
              href="/fr/boucaniers/comment-jouer"
              className="btn-primary-blue-rounded"
              style={{boxShadow: "0px 30px 5px 0px rgba(0, 0, 0, 0.18)" }}
            >
              Comment jouer
            </Link>
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


        </div> {/* End max-w-6xl for remaining content */}
      </div> {/* End #boucaniers */}
    </div>
  )
}
