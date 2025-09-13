import Image from 'next/image'

const teamMembers = [
  {
    id: 'vincent',
    image: '/team/Vinz.png',
    name: 'Vincent Tellier',
    role: 'Capitaine & Créateur',
    description: 'Concepteur du jeu Boucaniers et de ses mécaniques, auteur des illustrations, modéleur des figurines. Mordu d\'histoire.'
  },
  {
    id: 'remi',
    image: '/team/remi.png',
    name: 'Rémi Durand',
    role: 'Maître Charpentier',
    description: 'Fabricant des figurines. Ingénieur chevronné et pointilleux. Expert en impression 3D, assure la qualité de fabrication.'
  },
  {
    id: 'thierry',
    image: '/team/thierry.png',
    name: 'Thierry Durand',
    role: 'Quartier-maître',
    description: 'Concepteur de l\'idée première de Boucaniers, éternel insatisfait, qui dépouille le jeu de chaque défaut.'
  }
]

export default function TeamPage() {
  return (
    <div className="mt-8">
      <h1 className="text-5xl font-oldstyle text-[#0c0c0d] mb-8 text-center">
        L'équipage de Picaron
      </h1>

      <div className="max-w-4xl mx-auto mb-12 text-center">
        <p className="text-lg text-[#0c0c0d] leading-relaxed">
          Depuis de nombreuses années, nous inventons, testons et affinons des jeux rien que pour le plaisir de créer.
          Boucaniers est le premier à quitter le port pour rencontrer les joueurs, mais certainement pas le dernier.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-oldstyle text-[#0c0c0d] mb-1">
              {member.name}
            </h3>
            <p className="text-[#8b2020] font-oldstyle text-lg mb-3">
              {member.role}
            </p>
            <p className="text-[#0c0c0d]">
              {member.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}