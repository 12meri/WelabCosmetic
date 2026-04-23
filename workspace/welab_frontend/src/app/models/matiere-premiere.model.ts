export interface MatierePremiere {
  id?: number;   // <-- optionnel car lors de la création d'une nouvelle matière première, l'id n'est pas encore défini et sera généré par le backend, mais il est utile de le rendre optionnel pour pouvoir représenter à la fois les matières premières existantes (avec id) et les nouvelles matières premières en cours de création (sans id)
  '@id'?: string; // <-- optionnel, pour stocker l'URL de la ressource selon le format JSON-LD /api/matieres-premieres/{id}, ce qui peut être utile pour les opérations de mise à jour ou de suppression où l'URL de la ressource est nécessaire, mais il n'est pas obligatoire de l'avoir pour toutes les instances de MatierePremiere, d'où le fait de le rendre optionnel
  nomMP: string;
  INCI?: string;
  NOI?: string;
  categorie?: string;
  fonction?: string;
  cosmos?: string;
  fournirs?: string[];
  distribues?: string[];
  lots?: string[];
  demandeEchantillons?: string[];
}
