export interface MatierePremiere {
  id?: number;   // <-- optionnel
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
