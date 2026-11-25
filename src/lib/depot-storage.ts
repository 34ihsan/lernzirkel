import { join } from "path";

// public/ dışında — Next.js bunu statik olarak servis etmez, dosyalara sadece
// /api/depo/download/[id] üzerinden yetki kontrolünden geçerek erişilebilir.
export function getDepotDir(): string {
  return process.env.DEPOT_DIR || join(process.cwd(), "depot-storage");
}
