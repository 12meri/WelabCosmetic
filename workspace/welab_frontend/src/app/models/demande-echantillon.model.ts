export interface DemandeEchantillon {
  id?: number;
  dateDemande?: string;
  delaiLivraison?: string;
  etat: string;
  fournisseur: string;
  mp: string;
  alerte?: string;
}