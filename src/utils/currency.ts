export interface CountryInfo {
  code: string;
  nameEs: string;
  nameEn: string;
  currencyCode: string;
  currencySymbol: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'ES', nameEs: 'España', nameEn: 'Spain', currencyCode: 'EUR', currencySymbol: '€' },
  { code: 'MX', nameEs: 'México', nameEn: 'Mexico', currencyCode: 'MXN', currencySymbol: 'MX$' },
  { code: 'CO', nameEs: 'Colombia', nameEn: 'Colombia', currencyCode: 'COP', currencySymbol: 'COL$' },
  { code: 'AR', nameEs: 'Argentina', nameEn: 'Argentina', currencyCode: 'ARS', currencySymbol: 'AR$' },
  { code: 'CL', nameEs: 'Chile', nameEn: 'Chile', currencyCode: 'CLP', currencySymbol: 'CLP$' },
  { code: 'PE', nameEs: 'Perú', nameEn: 'Peru', currencyCode: 'PEN', currencySymbol: 'S/.' },
  { code: 'US', nameEs: 'Estados Unidos', nameEn: 'United States', currencyCode: 'USD', currencySymbol: '$' },
  { code: 'GB', nameEs: 'Reino Unido', nameEn: 'United Kingdom', currencyCode: 'GBP', currencySymbol: '£' },
  { code: 'EC', nameEs: 'Ecuador', nameEn: 'Ecuador', currencyCode: 'USD', currencySymbol: '$' },
  { code: 'UY', nameEs: 'Uruguay', nameEn: 'Uruguay', currencyCode: 'UYU', currencySymbol: '$U' },
  { code: 'VE', nameEs: 'Venezuela', nameEn: 'Venezuela', currencyCode: 'VES', currencySymbol: 'Bs.' },
  { code: 'BO', nameEs: 'Bolivia', nameEn: 'Bolivia', currencyCode: 'BOB', currencySymbol: 'Bs.' },
  { code: 'CR', nameEs: 'Costa Rica', nameEn: 'Costa Rica', currencyCode: 'CRC', currencySymbol: '₡' },
  { code: 'GT', nameEs: 'Guatemala', nameEn: 'Guatemala', currencyCode: 'GTQ', currencySymbol: 'Q' },
  { code: 'DO', nameEs: 'República Dominicana', nameEn: 'Dominican Republic', currencyCode: 'DOP', currencySymbol: 'RD$' },
  { code: 'PA', nameEs: 'Panamá', nameEn: 'Panama', currencyCode: 'USD', currencySymbol: '$' },
  { code: 'PY', nameEs: 'Paraguay', nameEn: 'Paraguay', currencyCode: 'PYG', currencySymbol: '₲' },
  { code: 'HN', nameEs: 'Honduras', nameEn: 'Honduras', currencyCode: 'HNL', currencySymbol: 'L' },
  { code: 'SV', nameEs: 'El Salvador', nameEn: 'El Salvador', currencyCode: 'USD', currencySymbol: '$' },
  { code: 'CA', nameEs: 'Canadá', nameEn: 'Canada', currencyCode: 'CAD', currencySymbol: 'CA$' },
  { code: 'EU', nameEs: 'Unión Europea', nameEn: 'European Union', currencyCode: 'EUR', currencySymbol: '€' },
];

export function getCountryByCode(code?: string): CountryInfo | undefined {
  if (!code) return undefined;
  return COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase());
}

export function getCountryByName(name?: string): CountryInfo | undefined {
  if (!name) return undefined;
  const lower = name.toLowerCase();
  return COUNTRIES.find(c => c.nameEs.toLowerCase() === lower || c.nameEn.toLowerCase() === lower || c.code.toLowerCase() === lower);
}

export function getAmazonDomainForCountry(countryNameOrCode?: string): string {
  if (!countryNameOrCode) return 'www.amazon.com';
  const c = countryNameOrCode.toLowerCase();
  if (c.includes('españa') || c.includes('spain') || c === 'es') return 'www.amazon.es';
  if (c.includes('méxico') || c.includes('mexico') || c === 'mx') return 'www.amazon.com.mx';
  if (c.includes('reino unido') || c.includes('united kingdom') || c === 'gb' || c === 'uk') return 'www.amazon.co.uk';
  if (c.includes('canadá') || c.includes('canada') || c === 'ca') return 'www.amazon.ca';
  if (c.includes('alemania') || c.includes('germany') || c === 'de') return 'www.amazon.de';
  if (c.includes('francia') || c.includes('france') || c === 'fr') return 'www.amazon.fr';
  if (c.includes('italia') || c.includes('italy') || c === 'it') return 'www.amazon.it';
  return 'www.amazon.com';
}
