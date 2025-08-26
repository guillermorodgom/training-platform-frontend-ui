import { Component, OnInit, Input } from '@angular/core';
import { Badge, BadgeRarity } from '../../../core/models';

@Component({
  selector: 'app-badge-display',
  templateUrl: './badge-display.component.html',
  styleUrls: ['./badge-display.component.scss']
})
export class BadgeDisplayComponent implements OnInit {
  @Input() badge!: Badge;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showDetails = true;
  @Input() clickable = false;

  BadgeRarity = BadgeRarity; // Exponer enum al template

  constructor() { }

  ngOnInit(): void {
  }

  getRarityClass(): string {
    return `rarity-${this.badge?.rarity?.toLowerCase() || 'common'}`;
  }

  getRarityLabel(rarity: BadgeRarity): string {
    const labels: { [key in BadgeRarity]: string } = {
      [BadgeRarity.COMMON]: 'Común',
      [BadgeRarity.RARE]: 'Raro',
      [BadgeRarity.EPIC]: 'Épico',
      [BadgeRarity.LEGENDARY]: 'Legendario'
    };
    return labels[rarity] || rarity;
  }

  onBadgeClick(): void {
    if (this.clickable) {
      // Emit event or navigate - could be implemented later
    }
  }

  isRecentlyEarned(): boolean {
    if (!this.badge?.earnedDate) return false;
    const earnedDate = new Date(this.badge.earnedDate);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - earnedDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7; // Consideramos "nuevo" si se ganó en los últimos 7 días
  }
}
