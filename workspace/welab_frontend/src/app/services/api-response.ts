export interface ApiResponse<T> {
  member: T[]; // au lieu de data ou items, on utilise member pour suivre la convention JSON-LD d’API Platform 
  totalItems?: number; // optionnel, peut être utilisé pour la pagination ou les statistiques
}
