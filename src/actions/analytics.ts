'use server';

import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * Tracks a privacy-first user event. No PII (IP address or cookies) is stored.
 */
export async function trackEvent(eventName: string, url: string, locale?: string) {
  try {
    // Only proceed in production or if you want to track dev too. 
    // We'll track everything here for demonstration.
    
    // We don't track IPs for GDPR compliance.
    await prisma.eventLog.create({
      data: {
        eventName,
        url,
        locale: locale || 'unknown',
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Analytics error:', error);
    return { success: false };
  }
}
