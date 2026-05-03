export interface ApiResponse<T> {
  member: T[]; // au lieu de data ou items, on utilise member pour suivre la convention JSON-LD d’API Platform 
  // differnte entre hydra[member] et member : hydra[member] est utilisé dans les réponses de collections paginées, tandis que member est utilisé pour les réponses de collections non paginées ou d'entités individuelles.
  totalItems?: number; // optionnel, peut être utilisé pour la pagination ou les statistiques
}
