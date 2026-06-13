export interface Clinic {
  province: string;
  name: string;
  pageLink?: string;
  logo?: string;
  cover?: string;
  review?: string;
  phone: string;
}

export interface CatalogItem {
  name: string;
  imageUrl: string;
}

export type ActivePage = 'cover' | 'dashboard' | 'register' | 'catalog';

export interface AppState {
  allClinics: Clinic[];
  catalogItems: CatalogItem[];
  dbStatus: 'checking' | 'connected' | 'demo';
}
