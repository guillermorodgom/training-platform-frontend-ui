export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: BadgeCategory;
  requirements: BadgeRequirement[];
  earnedDate?: Date;
  courseId?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface BadgeRequirement {
  type: 'course_completion' | 'quiz_score' | 'time_spent' | 'streak';
  value: any;
  description: string;
}

export enum BadgeCategory {
  COMPLETION = 'Completación',
  EXCELLENCE = 'Excelencia',
  SPEED = 'Velocidad',
  CONSISTENCY = 'Consistencia',
  MILESTONE = 'Hito'
}