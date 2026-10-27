import { useEffect } from 'react';
import { useOrderDetailStore } from '@/modules/order-detail/store';
import format from '@/services/format';
import { Badge } from '@/ui/components/badge';
import { Button } from '@/ui/components/button';
import { LoadError } from '@/ui/components/load-error';
import { Panel } from '@/ui/components/panel';
import { Skeleton } from '@/ui/components/skeleton';
import { Table } from '@/ui/components/table';
import { CATEGORY_TONES } from './constant';
import styles from './index.module.css';

interface SuppliesTableProps {
  number: string;
}

const title = (
  <>
    Supplies <span className={styles.hint}>stock items purchased as Platform Sale</span>
  </>
);

const actions = (
  <Button size="sm" disabled title="Not available in this demo">
    + Supply
  </Button>
);

export function SuppliesTable({ number }: SuppliesTableProps) {
  const { data, status, errorCode } = useOrderDetailStore((state) => state.supplies);
  const loadSupplies = useOrderDetailStore((state) => state.loadSupplies);

  useEffect(() => loadSupplies(number), [loadSupplies, number]);

  if (errorCode === 404) return null;
  if (status === 'error') {
    return <LoadError message="Could not load supplies." onRetry={() => loadSupplies(number)} />;
  }
  if (!data) return <SuppliesTableSkeleton />;

  const { items: supplies, subtotal } = data;

  return (
    <Panel title={title} flush actions={actions}>
      {supplies.length === 0 ? (
        <div className={styles.empty}>No supplies on this order.</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Category</th>
              <th data-align="right">Q-ty</th>
              <th data-align="right">Unit $</th>
              <th data-align="right">Line total</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((supply) => (
              <tr key={supply.id}>
                <td>{supply.sku}</td>
                <td>
                  <Badge tone={CATEGORY_TONES[supply.category] ?? 'gray'}>{supply.category}</Badge>
                </td>
                <td data-align="right">
                  <strong>{supply.quantity}</strong>
                </td>
                <td data-align="right">{format.money(supply.unitPrice)}</td>
                <td data-align="right">
                  <strong>{format.money(supply.lineTotal)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} data-align="right" className={styles.muted}>
                Supply subtotal
              </td>
              <td data-align="right">
                <strong>{format.money(subtotal)}</strong>
              </td>
            </tr>
          </tfoot>
        </Table>
      )}
    </Panel>
  );
}

const SKELETON_ROWS = 3;

function SuppliesTableSkeleton() {
  return (
    <Panel title={title} actions={actions}>
      <div className={styles.skeleton} aria-busy="true">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <Skeleton key={index} height={14} />
        ))}
      </div>
    </Panel>
  );
}
