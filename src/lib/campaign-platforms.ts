export const PLATFORMS = ['instagram', 'facebook', 'whatsapp', 'tiktok', 'other'] as const;
export type Platform = (typeof PLATFORMS)[number];
