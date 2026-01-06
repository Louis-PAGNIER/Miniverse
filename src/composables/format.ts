function removeTrailingZeros(value: string): string {
  return value.replace(/\.?0+$/, "");
}

export function formatBigNumber(n: number, decimals: number = 2): string {
  if (!Number.isFinite(n)) return "0";

  const abs = Math.abs(n);

  const units = [
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" },
  ];

  for (const unit of units) {
    if (abs >= unit.value) {
      const formatted = (n / unit.value).toFixed(decimals);
      return `${removeTrailingZeros(formatted)}${unit.suffix}`;
    }
  }

  return n.toString();
}

export function formatFileSize(n: number, decimals: number = 2): string {
  if (!Number.isFinite(n)) return "0B";

  const abs = Math.abs(n);

  const units = [
    { value: 1e12, suffix: "TB" },
    { value: 1e9, suffix: "GB" },
    { value: 1e6, suffix: "MB" },
    { value: 1e3, suffix: "KB" },
    { value: 1, suffix: "B" },
  ];

  for (const unit of units) {
    if (abs >= unit.value) {
      const formatted = (n / unit.value).toFixed(decimals);
      return `${removeTrailingZeros(formatted)} ${unit.suffix}`;
    }
  }

  return n.toString();
}

export function timeAgo(
  timestamp?: number | string | Date,
  now: Date = new Date()
): string {
  if (!timestamp)
    return '';

  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();

  if (isNaN(diffMs) || diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  return "just now";
}

export function computeVersionRange(versions: string[]): string {
  if (versions.length === 0) return ""

  if (versions.length === 1) {
    return versions[0]
  }

  const parse = (v: string) => v.split(".").map(Number)

  const compare = (a: string, b: string) => {
    const pa = parse(a)
    const pb = parse(b)
    const len = Math.max(pa.length, pb.length)

    for (let i = 0; i < len; i++) {
      const da = pa[i] ?? 0
      const db = pb[i] ?? 0
      if (da !== db) return da - db
    }
    return 0
  }

  const sorted = [...versions].sort(compare)

  return `${sorted[0]}-${sorted[sorted.length - 1]}`
}