import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getFingerprint = async (): Promise<string> => {
  let fingerprint = localStorage.getItem('fingerprint');
  if (!fingerprint) {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    fingerprint = result.visitorId;
    localStorage.setItem('fingerprint', fingerprint);
  }

  return fingerprint;
};
