export enum OrderType {
  CrossDock = 'cross_dock',
  Consolidation = 'consolidation',
}

export enum OrderStatus {
  Draft = 'draft',
  New = 'new',
  InProgress = 'in_progress',
  Completed = 'completed',
}

export enum OperationKind {
  Unloading = 'unloading',
  Disposal = 'disposal',
  Restack = 'restack',
  Loading = 'loading',
}

export const ACTIVE_STATUSES = [OrderStatus.New, OrderStatus.InProgress];
