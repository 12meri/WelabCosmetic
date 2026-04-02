import { Lot } from "./lots.model";

export interface Alerte {
    // alerte.model.ts

  id: number;
  typeAlerte: string;
  etatAlerte: 'ACTIVE' | 'TRAITEE' | 'IGNOREE'; // Utilisation des constantes définies dans votre backend
  dateAlerte: Date | string; // Peut être Date après parsing ou string venant de l'API
  message: string | null;
  lot: Lot | string |null; // Vous devrez également créer l'interface Lot
  demandes?: string; // Vous devrez également créer l'interface DemandeEchantillon


}
