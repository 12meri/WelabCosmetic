/**
 * Modèle représentant un Document uploadé dans l'application.
 *
 * Notes importantes :
 * - `dateUpload` est gérée côté serveur (le constructeur PHP de l'entité
 *   met automatiquement `new \DateTime()` à la création), donc on ne
 *   l'envoie pas dans le payload de création.
 * - `fileName` est rempli automatiquement par VichUploader après l'upload :
 *   il contient le nom physique du fichier sur disque (ex: "FT_argan-67ab2.pdf").
 *   On l'utilise pour construire l'URL de téléchargement vers
 *   /uploads/documents/{fileName}.
 * - `lots`, `matieres`, `fournisseurs` sont des relations ManyToMany.
 *   Au format JSON-LD d'API Platform, elles sont représentées par des
 *   TABLEAUX D'IRI au format "/api/lots/{id}", "/api/mat_premieres/{id}",
 *   "/api/fournisseurs/{id}". On n'envoie jamais d'objets complets, juste
 *   les références.
 * - Le FICHIER PHYSIQUE n'est PAS dans cette interface : il est uploadé
 *   séparément via un objet `FormData` (multipart/form-data) parce qu'on
 *   ne peut pas sérialiser un binaire dans du JSON. Voir DocumentService.create().
 * - `@id` est le champ JSON-LD renvoyé par API Platform (référence absolue
 *   de la ressource) : optionnel pour pouvoir le lire en GET.
 */
export interface Document {
  id?: number;
  '@id'?: string;
  nomFile: string;
  type?: string;
  dateUpload?: string;
  fileName?: string;
  lots?: string[];
  matieres?: string[];
  fournisseurs?: string[];
}
