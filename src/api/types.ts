export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  region: string;
  latitude: number;
  longitude: number;
  locality: string;
  timezone: string;
}

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean;
  links: {
    patch: {
      small: string | null;
    };
  };
  launchpad: Launchpad;
}