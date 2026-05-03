import { Lot } from "./lots.model";

export interface Alerte {
    
  id: number;
  typeAlerte: string;
  etatAlerte: 'ACTIVE' | 'TRAITEE' | 'IGNOREE'; 
  dateAlerte: Date | string; // Peut être Date après parsing ou string venant de l'API
  message: string | null;
  lot: Lot | string |null; 
  demandes?: string; 


}
