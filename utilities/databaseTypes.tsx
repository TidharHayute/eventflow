export interface Key {
  id: string;
  uid: string;
  lu: string;
  n: string;
}

export interface Category {
  id: number;
  uid: string;
  n: string;
  ic: number;
  t: number;
}

export interface Event {
  eid: number;
  uid: string;
  en: string;
  edes: string | null;
  et: Record<string, any> | null;
  ec: number;
  ed: string;
}

export interface Chart {
  n: string;
  t: number;
  c?: number;
  tag?: string;
}
