// Basit iCalendar (.ics) üretici — harici bağımlılık gerektirmez.

function toICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeICSText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
}

export function generateICS({
  uid,
  title,
  description,
  start,
  end,
  location,
  url,
}: {
  uid: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  location?: string;
  url?: string;
}): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lernzirkel Ludwigshafen e.V.//Kursplaner//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}@lernzirkel-online.de`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end || start)}`,
    `SUMMARY:${escapeICSText(title)}`,
  ];
  if (description) lines.push(`DESCRIPTION:${escapeICSText(description)}`);
  if (location) lines.push(`LOCATION:${escapeICSText(location)}`);
  if (url) lines.push(`URL:${url}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}
