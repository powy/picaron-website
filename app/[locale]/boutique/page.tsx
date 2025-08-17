import NewsletterSection from '@/components/NewsletterSection'

export default function BoutiquePage() {
  return (
    <div className="mt-8 text-center">
      <h1 className="text-5xl font-oldstyle text-[#0c0c0d] mb-8">
        Boutique
      </h1>
      
      <div className="py-16">
        <h2 className="text-3xl font-oldstyle text-[#8b2020] mb-4">
          Trésor en construction
        </h2>
        <p className="text-xl text-[#0c0c0d] mb-8">
          Notre boutique ouvrira bientôt ses portes !
        </p>
        
        <div className="max-w-md mx-auto">
          <p className="mb-6 text-[#0c0c0d]">
            Inscrivez-vous pour être informé de l'ouverture
          </p>
          <NewsletterSection />
        </div>
      </div>
    </div>
  )
}