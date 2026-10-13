// Optimise les médias de public/ : PNG/JPG → WebP, GIF → WebP animé ou MP4,
// vidéos sans piste audio. Le gain vient du format, pas de la définition :
// - images pleine largeur (bord à bord, grands écrans) : résolution native ;
// - images limitées à une colonne : jamais sous 2× leur largeur CSS maximale.
//
//   node scripts/optimize-media.mjs                 # sources = public/
//   node scripts/optimize-media.mjs --src <masters> # régénérer depuis les masters
//
// Les sources ne sont jamais supprimées par le script. Nécessite ffmpeg dans le
// PATH pour les vidéos.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const srcFlag = process.argv.indexOf('--src');
const srcDir = srcFlag > -1 ? path.resolve(process.argv[srcFlag + 1]) : publicDir;

const P3 = 'boucanier3/boucaniers 3_fichiers';

// Image fixe → WebP (q85 : indiscernable de l'original à l'écran).
const still = (src, out = src.replace(/\.(png|jpe?g)$/i, '.webp')) => ({ kind: 'still', src, out });
// Image fixe → plusieurs largeurs WebP (srcset) : `${base}-${w}.webp`.
const responsive = (src, base, widths) => ({ kind: 'responsive', src, base, widths });
// GIF transparent → WebP animé (seul format animé avec alpha lu partout).
const animated = (src, maxWidth) => ({ kind: 'animated', src, out: src.replace(/\.gif$/i, '.webp'), maxWidth });
// GIF opaque → MP4 H.264 (lu partout, <video autoplay muted loop playsinline>).
const gifVideo = (src) => ({ kind: 'gif-video', src, out: src.replace(/\.gif$/i, '.mp4') });
// Vidéo muette : retire la piste audio sans réencoder.
const stripAudio = (src) => ({ kind: 'strip-audio', src, out: src });

const JOBS = [
  // Page présentation
  responsive('Présentation-KS2-transparent.png', 'presentation/presentation-ks2', [1080, 1600, 2180]),
  still('Tache-rouge-avec-texture.png'),
  still('3-Fond-bleu-avec-texture2.png'),
  still('11-Tache-d_encre-bleue-TEXTURÉE.png'),
  still('8-a-CORRECTED-Petite-Tache-TEXTUREE.png'),
  still('assets-presentation/8 Episodes-d_Armand.png'),
  still('assets-presentation/8-Nouvelle-illustrée-intérieur.png'),
  still(`${P3}/9-zephyr.png`),
  still(`${P3}/9-poseidon.png`),
  still(`${P3}/9-Petit-bateau-droite.png`),
  still(`${P3}/9-Petit-bateau-gauche.png`),
  animated('assets-presentation/0_Singe_rallongé_petit.gif'),
  animated('assets-presentation/4_Vieux_Loup_de_mer_transparent_petit.gif'),
  animated('assets-presentation/4_nombre_de_joueurs.gif'),
  animated(`${P3}/5-rejouabilite.gif`),
  // Colonne max-w-7xl / 2 ≈ 608 px CSS → 1216 px suffisent (natif : 1800).
  animated(`${P3}/7-Indices-ile superposes.gif`, 1216),
  stripAudio(`${P3}/1_Jouez_en_simultane.webm`),
  stripAudio(`${P3}/2_Mecanique fluide.webm`),
  stripAudio(`${P3}/3_Une_epopee_a_deux_objectifs.webm`),
  stripAudio(`${P3}/7_Fidelite_historique.webm`),
  stripAudio(`${P3}/10_Figurines_faites_maison_Petit.webm`),
  // Réencodé en H.264 CRF 23, il grossissait : on retire seulement l'audio.
  stripAudio(`${P3}/4_Profondeur_de_jeu.mp4`),
  // Page comment jouer
  gifVideo(`${P3}/image015.gif`),
  gifVideo(`${P3}/image016.gif`),
  // Boutique, navigation, équipe, fond commun
  still('assets/Nouvelle-illustrée.png'),
  still('assets/Nouvelle-illustrée-intérieur.png'),
  still('assets/Shopping_panier.png'),
  still('assets/Shopping_panier_blanc.png'),
  still('assets/LogoPICARONJ1Pour_Fond_Sombre3.png'),
  still('assets/PICARON_LOGO.png'),
  still('team/Vinz.png'),
  still('team/remi.png'),
  still('team/thierry.png'),
  // backgrounds/Fond-infini.jpg : déjà plus léger en JPEG qu'en WebP.
];

const ffmpeg = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

// Écrit via un fichier temporaire : permet src === out (traitement en place).
async function write(out, produce) {
  const dest = path.join(publicDir, out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const tmp = path.join(path.dirname(dest), `.tmp-${path.basename(dest)}`);
  await produce(tmp);
  fs.renameSync(tmp, dest);
  return fs.statSync(dest).size;
}

const kib = (n) => `${Math.round(n / 1024)} KiB`;

async function run(job) {
  const input = path.join(srcDir, job.src);
  const before = fs.statSync(input).size;
  let after = 0;
  switch (job.kind) {
    case 'still':
      after = await write(job.out, (tmp) => sharp(input).webp({ quality: 85, effort: 6 }).toFile(tmp));
      break;
    case 'responsive': {
      const { width } = await sharp(input).metadata();
      for (const w of job.widths) {
        after += await write(`${job.base}-${w}.webp`, (tmp) =>
          sharp(input).resize({ width: Math.min(w, width) }).webp({ quality: 85, effort: 6 }).toFile(tmp)
        );
      }
      break;
    }
    case 'animated':
      after = await write(job.out, (tmp) =>
        sharp(input, { animated: true })
          .resize({ width: job.maxWidth, withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(tmp)
      );
      break;
    case 'gif-video':
      after = await write(job.out, (tmp) =>
        ffmpeg(['-i', input, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p',
          '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-movflags', '+faststart', '-f', 'mp4', tmp])
      );
      break;
    case 'strip-audio': {
      const format = path.extname(job.out).slice(1);
      const extra = format === 'mp4' ? ['-movflags', '+faststart'] : [];
      after = await write(job.out, (tmp) => ffmpeg(['-i', input, '-an', '-c:v', 'copy', ...extra, '-f', format, tmp]));
      break;
    }
  }
  console.log(`${kib(before).padStart(10)} → ${kib(after).padStart(9)}  ${job.src}`);
  return [before, after];
}

let totalBefore = 0;
let totalAfter = 0;
for (const job of JOBS) {
  const [b, a] = await run(job);
  totalBefore += b;
  totalAfter += a;
}
console.log(`\nTotal : ${kib(totalBefore)} → ${kib(totalAfter)}`);
