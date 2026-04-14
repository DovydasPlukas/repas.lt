import { OrderDetails } from '../../lib/types';
import { getStatusLabel } from '../../utils/order';
import { formatDate, formatRange } from '../../utils/formatters';

type Props = {
  order: OrderDetails;
  totalPrice: number;
};

export function OrderMeta({ order, totalPrice }: Props) {
  return (
    <>
      {/* Status & Date */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
        <div className="grid gap-4 grid-cols-2">
          <div>
            <p className="text-xs text-gray-600">Užsakymo statusas</p>
            <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-blue-100">
              <span className="text-sm font-medium text-blue-700">
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600">Užsakymo data</p>
            <p className="mt-2 font-medium text-gray-900">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Pickup & Delivery Times */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
        <div className="grid gap-4 grid-cols-2">
          <div>
            <p className="text-xs text-gray-600">Paėmimas</p>
            <p className="mt-2 font-medium text-gray-900">
              {order.pickupStart || order.pickupEnd
                ? formatRange(order.pickupStart ?? null, order.pickupEnd ?? null)
                : order.pickupDateTime
                  ? formatRange(order.pickupDateTime, null)
                  : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Pristatymas</p>
            <p className="mt-2 font-medium text-gray-900">
              {order.deliveryStart || order.deliveryEnd
                ? formatRange(order.deliveryStart ?? null, order.deliveryEnd ?? null)
                : order.deliveryDateTime
                  ? formatRange(order.deliveryDateTime, null)
                  : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="rounded-lg border-2 border-[--RepasBlue] bg-blue-50 p-6 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-900">Bendra suma</p>
          <p className="text-2xl font-bold text-gray-900">€{totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </>
  );
}