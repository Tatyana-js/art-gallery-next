import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const fingerprint = async (): Promise<string> => {
  if (typeof window !== 'undefined') {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  }
  return 'server-side-fingerprint';
};
