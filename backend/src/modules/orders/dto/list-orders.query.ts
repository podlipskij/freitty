import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { OrderStatus } from '../order.enums';

export const ORDER_TABS = ['all', 'cross_dock', 'consolidation', 'alerts', 'drafts'] as const;
export type OrderTab = (typeof ORDER_TABS)[number];

export const ORDER_PERIODS = ['any', 'today', 'week', '30d'] as const;
export type OrderPeriod = (typeof ORDER_PERIODS)[number];

export class OrderFiltersQuery {
  @IsOptional()
  @IsIn(ORDER_TABS)
  tab: OrderTab = 'all';

  @IsOptional()
  @IsUUID()
  hubId?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsIn(ORDER_PERIODS)
  period: OrderPeriod = 'any';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}

export class ListOrdersQuery extends OrderFiltersQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 12;
}
