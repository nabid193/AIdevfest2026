import latinUrl from '@fontsource/noto-sans-bengali/files/noto-sans-bengali-latin-400-normal.woff?url';
import bengaliUrl from '@fontsource/noto-sans-bengali/files/noto-sans-bengali-bengali-400-normal.woff?url';
import type { PackageFonts } from './createPackage';
let cached: Promise<PackageFonts> | undefined;
export function loadPackageFonts(): Promise<PackageFonts> {
  cached ??= Promise.all([latinUrl, bengaliUrl].map(async url => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('fontLoad');
    return new Uint8Array(await response.arrayBuffer());
  })).then(([latin, bengali]) => ({ latin: latin!, bengali: bengali! })).catch(error => { cached = undefined; throw error; });
  return cached;
}
