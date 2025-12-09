export function isReleaseVersion(version: string): boolean {
  const releasePattern = /^\d+(\.\d+){1,2}$/;
  return releasePattern.test(version);
}