import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('cookies.title'),
    description: t('cookies.description')
  }
}

export default function Cookies() {
  return (
    <div className="mt-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="title-page">Cookies</h1>

        <div className="prose prose-lg max-w-none text-ink space-y-8">
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

          <p className="legal-update-note">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}
