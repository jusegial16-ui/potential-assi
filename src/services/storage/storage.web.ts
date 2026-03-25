const MEMORY_KEY = 'mi-dia-web-storage';

type Bucket = Record<string, string>;

function readBucket(): Bucket {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(MEMORY_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Bucket;
  } catch {
    return {};
  }
}

function writeBucket(bucket: Bucket) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEMORY_KEY, JSON.stringify(bucket));
}

export const webStorage = {
  get(key: string) {
    return readBucket()[key];
  },
  set(key: string, value: string) {
    const bucket = readBucket();
    bucket[key] = value;
    writeBucket(bucket);
  }
};
