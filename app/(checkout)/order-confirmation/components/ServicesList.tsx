import { OrderService } from '../../lib/types';

type Props = {
  services: OrderService[];
};

export function ServicesList({ services }: Props) {
  if (services.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">Užsakytos paslaugos</h3>
      <div className="space-y-4">
        {services.map((os) => {
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
  );
}