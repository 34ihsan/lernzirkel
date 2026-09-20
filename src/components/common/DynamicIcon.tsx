import React from 'react';
import * as Icons from 'lucide-react';

export const AVAILABLE_ICONS = [
  'BookOpen',
  'GraduationCap',
  'Users',
  'Users2',
  'LifeBuoy',
  'Info',
  'HandHeart',
  'Phone',
  'FileText',
  'Globe',
  'School',
  'MessageCircle',
  'HeartHandshake',
  'Lightbulb',
  'Shield',
  'Languages',
  'FileCheck',
  'CheckCircle',
  'CheckCircle2',
  'Award',
  'Clock',
  'Star',
  'HelpCircle',
  'Sparkles',
  'Target',
  'Briefcase',
  'Calendar',
  'MapPin',
  'Mail',
  'Folder',
  'Compass',
  'Heart',
  'Building2',
  'Smile',
  'SmilePlus',
  'TrendingUp',
  'Layers',
  'Settings'
];

interface DynamicIconProps {
  name?: string;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ name, className = 'w-6 h-6', size }: DynamicIconProps) {
  if (!name) return null;
  // @ts-ignore
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={size} />;
}
