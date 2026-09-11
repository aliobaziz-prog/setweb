# Templates par métier

Ces dossiers sont des exemples prêts à l'emploi, dérivés du template de base
(`/index.html`, `/style.css`, `/script.js` à la racine), chacun avec ses
propres textes, couleurs et services. Chaque dossier est autonome : ouvrez
simplement son `index.html`.

- `plombier/` — Plomberie Dupont (Lyon) — palette bleu/marine, services :
  dépannage d'urgence, installation sanitaire, chauffage, rénovation salle de bain.
- `menuisier/` — Menuiserie Lefèvre (Nantes) — palette bois/ambre, services :
  mobilier sur mesure, pose de parquet, escaliers, rénovation charpente.
- `agriculteur/` — Ferme des Trois Chênes (Normandie) — palette verte, produits :
  fruits & légumes, paniers fermiers, produits laitiers, visite de la ferme.

## Pour un nouveau client dans ces métiers

1. Dupliquez le dossier du métier le plus proche.
2. Remplacez le nom du commerce, la ville, les coordonnées et les images
   `placehold.co` par les vraies infos/photos.
3. Ajustez les couleurs dans le bloc `:root` de `style.css` si besoin.
4. Mettez à jour l'iframe Google Maps dans la section `#location`.

Pour un métier non couvert ici (boulangerie, coiffeur, restaurant...), partez
du template de base à la racine du dépôt et suivez le même processus.
