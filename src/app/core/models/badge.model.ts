export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  points: number;
  courseId?: number;
  requirements?: string;
  earnedDate?: Date;
}

export interface BadgeRequirement {
  type: 'course_completion' | 'quiz_score' | 'time_spent' | 'streak';
  value: any;
  description: string;
}

export enum BadgeCategory {
  COMPLETION = 'COMPLETION',
  EXCELLENCE = 'EXCELLENCE',
  SPEED = 'SPEED',
  CONSISTENCY = 'CONSISTENCY',
  MILESTONE = 'MILESTONE'
}

export enum BadgeRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}