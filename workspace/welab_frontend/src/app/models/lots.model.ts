export interface Lot {
  id?: number;
  numLot: string;
  dateArrivee?: string;
  ddm?: string;
  qtInitiale: string;
  qtRestante?: string;
  dateMaj?: string;
  qtMin?: string;
  etat?: string;
  mp?: string;
  demandeEchantillon?: string;
  alertes?: string[];
}