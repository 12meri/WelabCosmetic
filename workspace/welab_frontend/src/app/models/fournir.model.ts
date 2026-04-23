// fournir.model.ts
import { MatierePremiere } from './matiere-premiere.model';
import { Fournisseur } from './fournisseur.model';
import { Distribution } from './distribution.model';

export interface Fournir {
  id?: number;
  matPrem: MatierePremiere | string;      // soit l'objet complet, soit l'IRI
  fournisseur: Fournisseur | string;      // IRI ou objet
  distribution?: Distribution | string | null; // peut être null
  prix?: string | null;
  moq?: string | null;
}