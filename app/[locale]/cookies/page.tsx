export default function Cookies() {
  return (
    <div className="mt-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-oldstyle font-normal text-[#8b2020] mb-6">Cookies</h1>

        <div className="prose prose-lg max-w-none text-[#0c0c0d] space-y-8">
          <section>
            <p>
              Le site picaron.fr utilise uniquement des cookies strictement nécessaires à son fonctionnement technique.
              Aucun cookie de mesure d&apos;audience, de publicité, de suivi ou de profilage n&apos;est utilisé.
            </p>
          </section>

          <section>
            <p>
              Ces cookies indispensables ne requièrent pas de consentement, conformément au Règlement (UE) 2016/679 (RGPD)
              et aux recommandations de la CNIL.
            </p>
          </section>

          <section>
            <p>
              Vous pouvez configurer votre navigateur pour bloquer ou supprimer les cookies, mais certaines fonctionnalités
              techniques du site pourraient ne plus fonctionner correctement.
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
