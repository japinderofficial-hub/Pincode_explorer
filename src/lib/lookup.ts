import { bangalorePincodeData } from './bangalore-data';

export type LookupMode = 'pincode' | 'area';

export type LookupResult = {
  pincode: string;
  areas: string[];
};

const normalize = (value: string) => value.trim().toLowerCase();

export function lookupBangalorePincodes(query: string, mode: LookupMode = 'pincode'): LookupResult[] {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [];
  }

  if (mode === 'pincode' || /^\d{6}$/.test(normalizedQuery)) {
    return bangalorePincodeData.filter((entry) => entry.pincode.includes(normalizedQuery));
  }

  return bangalorePincodeData.filter((entry) =>
    entry.areas.some((area) => area.toLowerCase().includes(normalizedQuery))
  );
}
