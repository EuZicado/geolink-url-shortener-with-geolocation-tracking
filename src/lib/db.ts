interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface LogEntry {
  timestamp: Date;
  location?: LocationData;
  userAgent?: string;
  ip?: string;
}

interface LinkData {
  originalUrl: string;
  createdAt: Date;
  logs: LogEntry[];
}

// In-memory storage for demonstration
const linkStore: Map<string, LinkData> = new Map();

export function addLink(shortCode: string, originalUrl: string): void {
  try {
    linkStore.set(shortCode, {
      originalUrl,
      createdAt: new Date(),
      logs: []
    });
  } catch (error) {
    console.error('Error adding link:', error);
    throw new Error('Failed to store link');
  }
}

export function getLink(shortCode: string): LinkData | undefined {
  try {
    return linkStore.get(shortCode);
  } catch (error) {
    console.error('Error retrieving link:', error);
    return undefined;
  }
}

export function addLog(shortCode: string, log: Omit<LogEntry, 'timestamp'>): void {
  try {
    const linkData = linkStore.get(shortCode);
    if (linkData) {
      linkData.logs.push({
        ...log,
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error('Error adding log:', error);
    throw new Error('Failed to log data');
  }
}

export function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getAllLinks(): Map<string, LinkData> {
  return new Map(linkStore);
}
