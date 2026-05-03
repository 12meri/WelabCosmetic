export interface ContactFournisseur {
  id?: number;
  '@id'?: string; // @id est different de id et est utilisé pour les références dans API Platform optionnellement
  nom: string;
  prenom?: string;
  fonction?: string;
  email?: string;
  telContact?: string;
  fournisseur?: string;
}
