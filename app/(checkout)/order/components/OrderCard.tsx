import { OrderDetails } from '../../lib/types';
import { getStatusLabel } from '../../utils/order';
import { formatRange } from '../../utils/formatters';

type Props = {
  order: OrderDetails;
  onClick: (order: OrderDetails) => void;
};

export function OrderCard({ order, onClick }: Props) {
  const pickupLabel =
    order.pickupStart || order.pickupEnd
      ? formatRange(order.pickupStart ?? null, order.pickupEnd ?? null)
      : order.pickupDateTime
        ? formatRange(order.pickupDateTime, null)
        : '-';

  const deliveryLabel =
    order.deliveryStart || order.deliveryEnd
      ? formatRange(order.deliveryStart ?? null, order.deliveryEnd ?? null)
      : order.deliveryDateTime
        ? formatRange(order.deliveryDateTime, null)
        : '-';

  return (
    <button
      onClick={() => onClick(order)}
      className="w-full text-left rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-300 transition-all"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div>
          <p className="text-xs text-gray-600 mb-1">Užsakymo numeris</p>
          <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Statusas</p>
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-sm font-medium text-blue-700">
            {getStatusLabel(order.status)}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Paėmimas</p>
          <p className="text-sm font-medium text-gray-900">{pickupLabel}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Pristatymas</p>
          <p className="text-sm font-medium text-gray-900">{deliveryLabel}</p>
        </div>
      </div>
    </button>
  );
}