export default function MentionsLegales() {
  return (
    <div className="mt-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-oldstyle text-[#8b2020] mb-6">Mentions Légales</h1>

        <div className="prose prose-lg max-w-none text-[#0c0c0d] space-y-8">
          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Éditeur du site</h2>
            <div className="bg-[#f2e8d5]/20 p-4 rounded-lg">
              <p>
                Picaron<br />
                [Forme juridique] au capital de [montant] €<br />
                [Adresse du siège social]<br />
                RCS [Ville] [Numéro]<br />
                TVA Intracommunautaire: [Numéro]<br />
                Email: contact@picaron.fr<br />
                Téléphone: [Numéro]
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Directeur de la publication</h2>
            <p>[Nom du directeur]</p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Hébergement</h2>
            <div className="bg-[#f2e8d5]/20 p-4 rounded-lg">
              <p>
                Vercel Inc.<br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789<br />
                États-Unis
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble de ce site relève de la législation française et internationale
              sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de
              reproduction sont réservés, y compris pour les documents téléchargeables
              et les représentations iconographiques et photographiques.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-oldstyle text-[#8b2020] mb-4">Données personnelles</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD),
              vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression des
              données vous concernant. Pour exercer ce droit, contactez-nous à :{' '}
              <a href="mailto:contact@picaron.fr" className="text-[#8b2020] hover:underline">
                contact@picaron.fr
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