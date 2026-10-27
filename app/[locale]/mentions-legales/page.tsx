import Link from 'next/link'

export default function MentionsLegales() {
  return (
    <div className="mt-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="title-page">Mentions légales</h1>

        <div className="prose prose-lg max-w-none text-ink stack-y-8">
          <section>
            <h2 className="heading-section-on-light">1. Éditeur du site</h2>
            <p>Le site https://picaron.fr/ est édité par :</p>
            <p className="ml-4">
              Picaron SARL<br />
              Siège social : 15 rue Georges Pitard, 75015 Paris, France<br />
              SIREN : 940441843<br />
              Forme juridique : Société à responsabilité limitée (SARL)<br />
              Capital social : 6 000 €<br />
              Directeur de la publication : Thierry DURAND (Gérant)<br />
              Formulaire de contact :{' '}
              <a href="https://picaron.fr/fr/contact" className="text-pirate-red underline">
                https://picaron.fr/fr/contact
              </a>
            </p>
          </section>

          <section>
            <h2 className="heading-section-on-light">2. Hébergeur</h2>
            <p>Le site est hébergé par :</p>
            <p className="ml-4">
              Vercel Inc.<br />
              Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
              Site :{' '}
              <a href="https://vercel.com/" className="text-pirate-red underline" target="_blank" rel="noopener noreferrer">
                https://vercel.com/
              </a>
            </p>
          </section>

          <section>
            <h2 className="heading-section-on-light">3. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus du site (textes, images, graphismes, logos, vidéos, noms, marques, etc.)
              est protégé par le droit de la propriété intellectuelle et reste la propriété exclusive de Picaron SARL
              ou de leurs titulaires respectifs.
            </p>
            <p className="mt-4">
              Toute reproduction, représentation, modification ou exploitation, totale ou partielle, est interdite
              sans autorisation écrite préalable.
            </p>
          </section>

          <section>
            <h2 className="heading-section-on-light">4. Données personnelles</h2>
            <p>Les données personnelles collectées sur le site sont traitées par Picaron SARL pour les finalités suivantes :</p>
            <ul className="list-disc list-inside stack-y-1 ml-4">
              <li>traitement des commandes,</li>
              <li>gestion du service client,</li>
              <li>envoi de la newsletter (inscription volontaire).</li>
            </ul>
            <p className="mt-4">
              Picaron SARL ne conserve aucune donnée de paiement : celles-ci sont traitées exclusivement
              par notre prestataire de paiement Stripe.
            </p>
            <p className="mt-4">
              Conformément au règlement (UE) 2016/679 (RGPD), tout utilisateur dispose d&apos;un droit d&apos;accès,
              de rectification, de suppression et d&apos;opposition concernant ses données personnelles.
              Ces droits peuvent être exercés via le formulaire de contact :{' '}
              <a href="https://picaron.fr/fr/contact" className="text-pirate-red underline">
                https://picaron.fr/fr/contact
              </a>
            </p>
            <p className="mt-4">
              Pour plus d&apos;informations, consultez notre{' '}
              <Link href="/fr/politique-confidentialite" className="text-pirate-red underline">
                Politique de Confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="heading-section-on-light">5. Cookies</h2>
            <p>
              Le site utilise uniquement des cookies strictement nécessaires à son fonctionnement.
              Aucun cookie publicitaire ou d&apos;analyse n&apos;est déposé.
            </p>
          </section>

          <section>
            <h2 className="heading-section-on-light">6. Responsabilité</h2>
            <p>
              Picaron SARL met tout en œuvre pour assurer l&apos;exactitude des informations diffusées sur le site
              mais ne saurait être tenue responsable des erreurs, omissions ou de l&apos;indisponibilité du service.
              L&apos;utilisation du site se fait sous la seule responsabilité de l&apos;utilisateur.
            </p>
          </section>

          <section>
            <h2 className="heading-section-on-light">7. Recyclage et obligations légales (REP)</h2>
            <p>
              Conformément à la loi AGEC, Picaron SARL rejoindra la filière REP Emballages.
              Identifiant unique ADEME : en cours d&apos;attribution.
            </p>
          </section>

          <section>
            <h2 className="heading-section-on-light">8. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français.
              En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <p className="legal-update-note">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}
