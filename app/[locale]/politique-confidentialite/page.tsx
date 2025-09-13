export default function PolitiqueConfidentialite() {
  return (
    <div className="mt-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-oldstyle text-[#8b2020] mb-6">Politique de Confidentialité</h1>

        <div className="prose prose-lg max-w-none text-[#0c0c0d] space-y-8">
          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">1. Collecte des données</h2>
            <p>Nous collectons les données suivantes lors de votre commande :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Adresse de livraison</li>
              <li>Numéro de téléphone (optionnel)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">2. Utilisation des données</h2>
            <p>Vos données personnelles sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Traiter et livrer votre commande</li>
              <li>Vous envoyer des confirmations de commande</li>
              <li>Communiquer sur le statut de votre livraison</li>
              <li>Répondre à vos demandes de service client</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">3. Paiement sécurisé</h2>
            <p>
              Les informations de paiement sont traitées directement par Stripe,
              notre prestataire de paiement certifié PCI DSS. Nous ne stockons jamais
              vos informations de carte bancaire sur nos serveurs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">4. Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles pendant la durée nécessaire
              au traitement de votre commande et conformément aux obligations légales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d&apos;opposition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">6. Cookies</h2>
            <p>
              Notre site utilise des cookies essentiels pour le fonctionnement du
              panier et du processus de commande. Ces cookies sont nécessaires et
              ne peuvent être désactivés.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">7. Contact</h2>
            <p>Pour toute question concernant vos données personnelles, contactez-nous :</p>
            <div className="bg-[#f2e8d5]/20 p-4 rounded-lg">
              <p>
                Email :{' '}
                <a href="mailto:contact@picaron.fr" className="text-[#8b2020] hover:underline">
                  contact@picaron.fr
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">8. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité
              à tout moment. Les modifications entrent en vigueur dès leur publication
              sur le site.
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