// Admin paneline giriş için şifre belirler/sıfırlar.
// Kullanım: npx tsx scripts/setAdminPassword.ts <email> <sifre> ["Ad Soyad"]
import prisma from '../src/lib/prisma';
import { hashPassword } from '../src/lib/auth';

async function main() {
  const [email, password, name] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Kullanım: npx tsx scripts/setAdminPassword.ts <email> <sifre> ["Ad Soyad"]');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Şifre en az 8 karakter olmalı.');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const existing = await prisma.teamMember.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
  });

  if (existing) {
    await prisma.teamMember.update({
      where: { id: existing.id },
      data: { passwordHash, adminRole: existing.adminRole || 'ADMIN' },
    });
    console.log(`Mevcut kayıt güncellendi: ${existing.name} <${email}> — şifre ayarlandı.`);
  } else {
    const created = await prisma.teamMember.create({
      data: {
        name: name || 'Admin',
        role: 'Yönetici',
        email,
        adminRole: 'ADMIN',
        passwordHash,
      },
    });
    console.log(`Yeni admin kullanıcı oluşturuldu: ${created.name} <${email}>`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
