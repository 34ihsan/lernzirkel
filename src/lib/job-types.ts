export interface JobTypeDef {
  value: string;
  label: string;
  badgeClass: string;
}

export const JOB_TYPES: JobTypeDef[] = [
  { value: 'LEHRER', label: 'Lehrkraft', badgeClass: 'bg-blue-50 text-blue-700' },
  { value: 'PRAKTIKANT', label: 'Praktikant', badgeClass: 'bg-emerald-50 text-emerald-700' },
  { value: 'VERWALTUNG', label: 'Verwaltungsmitarbeiter', badgeClass: 'bg-purple-50 text-purple-700' },
  { value: 'PRUEFER', label: 'Prüfer*in', badgeClass: 'bg-amber-50 text-amber-700' },
  { value: 'AZUBI', label: 'Azubi', badgeClass: 'bg-pink-50 text-pink-700' },
  { value: 'MINIJOB', label: 'Minijobber', badgeClass: 'bg-cyan-50 text-cyan-700' },
  { value: 'OTHER', label: 'Sonstiges', badgeClass: 'bg-gray-100 text-gray-700' },
];

export function getJobTypeDef(type: string): JobTypeDef {
  return JOB_TYPES.find(t => t.value === type) ?? { value: type, label: 'Stellenangebot', badgeClass: 'bg-gray-100 text-gray-700' };
}
