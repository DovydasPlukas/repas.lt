import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { OrderDetails } from '../../lib/types';
import { getStatusLabel, calculateTotalPrice } from '../../utils/order';
import { formatDate, formatRange } from '../../utils/formatters';

type Props = {
  order: OrderDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OrderDetailModal({ order, open, onOpenChange }: Props) {
  const totalPrice = calculateTotalPrice(order);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle />
          <DialogClose />
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Number */}
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
            <p className="text-sm text-gray-600 mb-2">Užsakymo numeris</p>
            <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
          </div>

          {/* Contact & Address */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {/* Contact Information */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Kontaktinė informacija</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Vardas</p>
                  <p className="font-medium text-gray-900 break-words">{order.snapFirstName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Pavardė</p>
                  <p className="font-medium text-gray-900 break-words">{order.snapLastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Telefonas</p>
                  <p className="font-medium text-gray-900 break-words">{order.snapPhone}</p>
                </div>
                {order.snapEmail && (
                  <div>
                    <p className="text-xs text-gray-600">El. paštas</p>
                    <p className="font-medium text-gray-900 break-words">{order.snapEmail}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pristatymo adresas</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Gatvė</p>
                  <p className="font-medium text-gray-900 break-words">{order.snapStreet ?? '-'}</p>
                </div>
                {order.snapApartment && (
                  <div>
                    <p className="text-xs text-gray-600">Butas</p>
                    <p className="font-medium text-gray-900 break-words">{order.snapApartment}</p>
                  </div>
                )}
                {order.snapFloor && (
                  <div>
                    <p className="text-xs text-gray-600">Aukštas</p>
                    <p className="font-medium text-gray-900 break-words">{order.snapFloor}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Services */}
          {order.orderServices && order.orderServices.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Užsakytos paslaugos</h3>
              <div className="space-y-4">
                {order.orderServices.map((os) => {
                  const addonsTotal = (os.orderAddons ?? []).reduce(
                    (sum, addon) => sum + Number(addon.snapPrice ?? 0),
                    0,
                  );
                  return (
                    <div key={os.id} className="p-3 border rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">
                            {os.service?.name ?? os.serviceId}
                          </div>
                          {os.specialRequirements && (
                            <div className="text-sm text-gray-600">
                              Reikalavimai: {os.specialRequirements}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-800">
                          {os.orderAddons && os.orderAddons.length > 0
                            ? `€${addonsTotal.toFixed(2)}`
                            : '-'}
                        </div>
                      </div>
                      {os.orderAddons && os.orderAddons.length > 0 && (
                        <div className="mt-2 text-sm text-gray-700">
                          <div className="font-medium">Priedai:</div>
                          <ul className="list-disc ml-5">
                            {os.orderAddons.map((a) => (
                              <li key={a.id}>
                                {a.snapName ?? a.addonId}
                                {a.snapPrice ? ` - €${Number(a.snapPrice).toFixed(2)}` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.snapNotes && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Pastabos</h3>
              <p className="text-gray-700 whitespace-pre-wrap break-words">{order.snapNotes}</p>
            </div>
          )}

          {/* Status & Date */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
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
          <div className="rounded-lg border border-gray-200 bg-white p-6">
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
          <div className="rounded-lg border-2 border-[--RepasBlue] bg-blue-50 p-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">Bendra suma</p>
              <p className="text-2xl font-bold text-gray-900">€{totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}