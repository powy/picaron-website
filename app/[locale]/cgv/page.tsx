export default function CGV() {
  return (
    <div className="mt-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-oldstyle text-[#8b2020] mb-6">Conditions Générales de Vente</h1>

        <div className="prose prose-lg max-w-none text-[#0c0c0d] space-y-8">
          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Article 1 - Objet</h2>
            <p>
              Les présentes conditions générales de vente s&apos;appliquent à toutes les ventes
              conclues sur le site www.picaron.fr
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Article 2 - Prix</h2>
            <p>
              Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC).
              Le prix indiqué est de 69,00 € TTC pour le jeu Boucaniers.
              Les frais de port sont calculés et affichés lors de la validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Article 3 - Commande</h2>
            <p>
              Vous pouvez passer commande uniquement sur internet via notre site.
              Les informations contractuelles sont présentées en langue française.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Article 4 - Validation</h2>
            <p>
              Toute commande implique l&apos;acceptation des présentes Conditions Générales de Vente.
              Un email de confirmation sera envoyé après validation du paiement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Article 5 - Paiement</h2>
            <p>
              Le paiement s&apos;effectue par carte bancaire via notre prestataire sécurisé Stripe.
              Le débit de la carte est effectué au moment de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Article 6 - Livraison</h2>
            <p>
              Les produits sont livrés à l&apos;adresse indiquée lors de la commande.
              Livraison uniquement en France métropolitaine.
              Pour l&apos;international, merci de nous contacter directement.
              Délai de livraison estimé : mi-décembre {new Date().getFullYear()}.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Article 7 - Droit de rétractation</h2>
            <p>
              Conformément aux dispositions légales, vous disposez d&apos;un délai de 14 jours
              à compter de la réception de votre commande pour exercer votre droit de rétractation.
              Le produit doit être retourné dans son emballage d&apos;origine, non ouvert.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Article 8 - Garantie</h2>
            <p>
              Tous nos produits bénéficient de la garantie légale de conformité et de la
              garantie contre les vices cachés.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Article 9 - Responsabilité</h2>
            <p>
              La responsabilité de Picaron ne saurait être engagée pour tous
              les inconvénients ou dommages inhérents à l&apos;utilisation du réseau Internet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Article 10 - Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige,
              les tribunaux français sont seuls compétents.
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