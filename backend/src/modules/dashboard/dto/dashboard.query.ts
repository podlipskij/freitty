import { IsIn, IsOptional } from 'class-validator';

export const ACTIVITY_PERIODS = ['day', 'cw', 'month', 'quarter'] as const;
export type ActivityPeriod = (typeof ACTIVITY_PERIODS)[number];

export class DashboardQuery {
  @IsOptional()
  @IsIn(ACTIVITY_PERIODS)
  period: ActivityPeriod = 'cw';
}
