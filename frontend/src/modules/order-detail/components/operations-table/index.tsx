import { useEffect } from 'react';
import { useOrderDetailStore } from '@/modules/order-detail/store';
import format from '@/services/format';
import { Badge } from '@/ui/components/badge';
import { Button } from '@/ui/components/button';
import { LoadError } from '@/ui/components/load-error';
import { Panel } from '@/ui/components/panel';
import { Skeleton } from '@/ui/components/skeleton';
import { Table } from '@/ui/components/table';
import { OPERATION_LABELS } from '../../constant';
import styles from './index.module.css';

interface OperationsTableProps {
  number: string;
}

const actions = (
  <Button size="sm" disabled title="Operations are recorded by the warehouse">
    + Operation
  </Button>
);

export function OperationsTable({ number }: OperationsTableProps) {
  const { data: operations, status, errorCode } = useOrderDetailStore((state) => state.operations);
  const loadOperations = useOrderDetailStore((state) => state.loadOperations);

  useEffect(() => loadOperations(number), [loadOperations, number]);

  if (errorCode === 404) return null;
  if (status === 'error') {
    return <LoadError message="Could not load operations." onRetry={() => loadOperations(number)} />;
  }
  if (!operations) return <OperationsTableSkeleton />;

  return (
    <Panel title="Operations" flush actions={actions}>
      {operations.length === 0 ? (
        <div className={styles.empty}>No operations recorded yet.</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Operation</th>
              <th>Trailer</th>
              <th data-align="right">Q-ty</th>
              <th>Unit</th>
              <th>Applied at</th>
              <th>Attachments</th>
            </tr>
          </thead>
          <tbody>
            {operations.map((operation) => {
              const disposal = operation.kind === 'disposal';
              return (
                <tr key={operation.id} data-tone={disposal ? 'danger' : undefined}>
                  <td>
                    {disposal ? (
                      <Badge tone="red">{OPERATION_LABELS[operation.kind]}</Badge>
                    ) : (
                      <>
                        {operation.billable && (
                          <span className={styles.billable} title="Billable">
                            $
                          </span>
                        )}
                        {OPERATION_LABELS[operation.kind]}
                      </>
                    )}
                  </td>
                  <td>{operation.trailer ?? '—'}</td>
                  <td data-align="right" className={disposal ? styles.qtyDanger : styles.qty}>
                    {operation.quantity}
                  </td>
                  <td>{operation.unit}</td>
                  <td className={styles.muted}>{format.dateTime(operation.appliedAt)}</td>
                  <td className={styles.muted}>
                    💬 {operation.messagesCount} · 📷 {operation.photosCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Panel>
  );
}

const SKELETON_ROWS = 3;

function OperationsTableSkeleton() {
  return (
    <Panel title="Operations" actions={actions}>
      <div className={styles.skeleton} aria-busy="true">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <Skeleton key={index} height={14} />
        ))}
      </div>
    </Panel>
  );
}
