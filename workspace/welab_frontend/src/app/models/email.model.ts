/**
 * Modèle représentant un Email envoyé depuis l'application.
 *
 * Notes importantes :
 * - `dateEnvoie` est gérée côté serveur (le constructeur PHP de l'entité
 *   met automatiquement `new \DateTime()` à la création), donc on ne
 *   l'envoie pas dans le payload de création.
 * - `demandeEchantillon` est une IRI au format "/api/demande_echantillons/{id}".
 *   API Platform exige une référence sous forme de chaîne IRI (et non un objet)
 *   pour les relations ManyToOne dans les requêtes POST/PATCH.
 * - `@id` est le champ JSON-LD renvoyé par API Platform (référence absolue
 *   de la ressource) : on le garde optionnel pour pouvoir le lire en GET.
 */
export interface Email {
  id?: number;
  '@id'?: string;
  sujet?: string;
  txt?: string;
  dateEnvoie?: string;
  demandeEchantillon: string;
}
