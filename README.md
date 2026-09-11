# setweb

Template de site vitrine réutilisable pour commerces locaux (boulangeries,
salons de coiffure, artisans, restaurants...) en France. HTML/CSS/JS vanilla,
sans framework ni build.

## Fichiers

- `index.html` — structure complète de la page (Hero, À propos, Services,
  Galerie, Avis clients, Localisation, Horaires & Contact, Footer)
- `style.css` — design, responsive, variables CSS centralisées
- `script.js` — menu mobile, animations au scroll, validation du formulaire

## Personnaliser pour un nouveau client (quelques minutes)

1. **Charte graphique** : ouvrez `style.css`, modifiez le bloc `:root` en haut
   du fichier (couleurs `--color-primary`, `--color-secondary`, polices...).
   Tout le site s'adapte automatiquement.
2. **Textes et images** : dans `index.html`, remplacez les textes d'exemple
   ("Nom du Commerce", slogans, services, horaires, adresse) et les URLs
   `https://placehold.co/...` par les vraies photos du client.
3. **Carte** : dans la section `#location`, remplacez le `src` de l'iframe par
   l'URL d'intégration Google Maps du client (Google Maps → Partager →
   Intégrer une carte).
4. **Formulaire de contact** : `script.js` valide le formulaire côté client
   mais ne l'envoie pas réellement. Branchez un service d'envoi (Formspree,
   EmailJS, back-end du client, etc.) dans `initContactForm()`.
5. **Réseaux sociaux / mentions légales** : mettez à jour les liens du footer.

## Lancer en local

Aucune installation nécessaire : ouvrez `index.html` dans un navigateur, ou
servez le dossier avec un petit serveur statique (ex. `python3 -m http.server`).
