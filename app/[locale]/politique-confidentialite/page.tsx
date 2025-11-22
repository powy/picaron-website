export default function PolitiqueConfidentialite() {
  return (
    <div className="mt-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-oldstyle font-normal text-[#8b2020] mb-6">Politique de Confidentialité</h1>

        <div className="prose prose-lg max-w-none text-[#0c0c0d] space-y-8">
          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">1. Responsable du traitement</h2>
            <p>Le responsable du traitement des données personnelles est :</p>
            <p className="ml-4">
              Picaron SARL<br />
              15 rue Georges Pitard, 75015 Paris<br />
              SIREN 940441843
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">2. Données que nous collectons</h2>
            <p>Nous collectons uniquement les données strictement nécessaires aux finalités suivantes :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Inscription à la newsletter : adresse email.</li>
              <li>Traitement des paiements : nom, email, adresse de facturation, informations de paiement (via Stripe).</li>
            </ul>
            <p className="mt-4">
              Aucune autre donnée personnelle n&apos;est collectée lors de la navigation sur le site.
              Nous ne réalisons aucune analyse comportementale, aucun suivi publicitaire, et aucun profilage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">3. Finalités des traitements</h2>
            <p>Les données personnelles sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>envoyer la newsletter à la demande de l&apos;utilisateur ;</li>
              <li>traiter et sécuriser les paiements via Stripe ;</li>
              <li>envoyer les emails de confirmation de commande.</li>
            </ul>
            <p className="mt-4">
              Nous n&apos;utilisons pas les données personnelles à des fins publicitaires ou pour de la revente de données.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">4. Sous-traitants</h2>
            <p>Nous utilisons les prestataires suivants :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Stripe Payments Europe : traitement des paiements. Politique de confidentialité :{' '}
                <a href="https://stripe.com/fr/privacy" className="text-[#8b2020] underline" target="_blank" rel="noopener noreferrer">
                  https://stripe.com/fr/privacy
                </a>
              </li>
            </ul>
            <p className="mt-4">
              Aucun autre prestataire externe n&apos;est utilisé pour la gestion de la newsletter. Les emails sont traités via notre messagerie (Gmail) uniquement pour l&apos;envoi manuel d&apos;informations aux personnes inscrites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">5. Cookies</h2>
            <p>
              Notre site utilise uniquement des cookies techniques nécessaires à son fonctionnement.
              Aucun cookie publicitaire ou analytique n&apos;est déposé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">6. Durée de conservation</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Email de newsletter : conservé tant que vous êtes inscrit. Vous pouvez vous désinscrire à tout moment en nous contactant via le formulaire.</li>
              <li>Données de paiement : conservées uniquement par Stripe conformément à leurs obligations légales.</li>
            </ul>
            <p className="mt-4">Picaron ne conserve aucune donnée de paiement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">7. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits d&apos;accès, de rectification, d&apos;effacement, de limitation et d&apos;opposition.
            </p>
            <p className="mt-4">
              Pour exercer vos droits, vous pouvez nous contacter via notre formulaire dédié :{' '}
              <a href="https://picaron.fr/fr/contact" className="text-[#8b2020] underline">
                https://picaron.fr/fr/contact
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">8. Sécurité</h2>
            <p>
              Nous ne stockons aucune donnée sensible sur nos serveurs. Les paiements sont traités exclusivement via Stripe, certifié PCI-DSS.
              Les informations relatives à la newsletter sont gérées de façon sécurisée via notre messagerie.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">9. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité, vous pouvez nous écrire via :{' '}
              <a href="https://picaron.fr/fr/contact" className="text-[#8b2020] underline">
                https://picaron.fr/fr/contact
              </a>
            </p>
          </section>

          <p className="mt-12 text-sm text-gray-600 bg-[#f2e8d5]/20 p-4 rounded-lg">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}
