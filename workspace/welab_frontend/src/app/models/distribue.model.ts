export interface Distribue {
  id?: number;
  '@id'?: string;
  distribution: string;   // IRI de la distribution associée exemple: "/api/distributions/1"
  mp: string;             // IRI
  contact?: string | null;
}