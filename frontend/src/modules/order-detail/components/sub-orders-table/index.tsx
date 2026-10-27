import type { SubOrder } from '@/modules/order';
import { Badge } from '@/ui/components/badge';
import { Panel } from '@/ui/components/panel';
import { Table } from '@/ui/components/table';
import styles from './index.module.css';

interface SubOrdersTableProps {
  subOrders: SubOrder[];
}

export function SubOrdersTable({ subOrders }: SubOrdersTableProps) {
  const total = subOrders.reduce((sum, sub) => sum + sub.pallets, 0);

  return (
    <Panel title={`Sub-orders · ${subOrders.length}`} flush>
      <Table>
        <thead>
          <tr>
            <th>Sub-order</th>
            <th>Ref N</th>
            <th data-align="right">Pallets</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {subOrders.map((sub) => (
            <tr key={sub.id} data-tone={sub.alertMessage ? 'danger' : undefined}>
              <td className={styles.subId}>{sub.id}</td>
              <td className={styles.ref}>{sub.refNumber}</td>
              <td data-align="right">{sub.pallets}</td>
              <td>
                {sub.alertMessage ? <Badge tone="red">⚠ {sub.alertMessage}</Badge> : <Badge tone="green">OK</Badge>}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} data-align="right">
              Total
            </td>
            <td data-align="right">
              <strong>{total}</strong>
            </td>
            <td />
          </tr>
        </tfoot>
      </Table>
    </Panel>
  );
}
