/**
 * Gerçek istemci IP'sini okur. Cloudflare arkasında çalıştığımız için `cf-connecting-ip`
 * öncelikli — bu header Cloudflare tarafından set edilir, istemci tarafından taklit
 * edilemez. `x-forwarded-for` zincir olabileceğinden (client, proxy1, proxy2...) sadece
 * ilk (en gerçek) değeri alıyoruz.
 */
export function getClientIp(headers: { get(name: string): string | null }): string {
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  return 'unknown-ip';
}
