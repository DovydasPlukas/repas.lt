import { OrderDetails } from '../../lib/types';

type Props = {
  order: OrderDetails;
};

export function OrderInfoGrid({ order }: Props) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-6">
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
  );
}