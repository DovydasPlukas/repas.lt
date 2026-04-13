import type { CartItem, OrderOverviewProps } from '@/components/checkout/types';

export type LocalAddon = {
  addonId?: string;
  addonName?: string;
  addonPrice?: number;
  id?: string;
  name?: string;
  price?: number;
};

export type LocalCartItem = {
  serviceId?: string;
  serviceName?: string;
  servicePrice?: number;
  price?: number;
  service?: { name?: string; price?: number };
  addons?: LocalAddon[];
  specialRequirements?: string;
};

export type FormDataRaw = OrderOverviewProps['formData'];

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('lt-LT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const getServiceBasePrice = (item?: LocalCartItem): number =>
  item?.servicePrice ?? item?.price ?? item?.service?.price ?? 0;

export const getAddonPrice = (addon?: LocalAddon): number =>
  addon?.addonPrice ?? addon?.price ?? 0;

export const getAddonName = (addon?: LocalAddon): string =>
  addon?.addonName ?? addon?.name ?? 'Priedas';

export const getServiceName = (item?: LocalCartItem): string =>
  item?.serviceName ?? item?.service?.name ?? 'Paslauga';

export const serviceTotal = (item?: LocalCartItem): number => {
  const base = getServiceBasePrice(item);
  const addonsSum = Array.isArray(item?.addons)
    ? item!.addons!.reduce((s, a) => s + getAddonPrice(a), 0)
    : 0;
  return base + addonsSum;
};

export const checkIsFormComplete = (
  formData: FormDataRaw | undefined,
  cart: CartItem[]
): boolean => {
  const requiredKeys = [
    'pickupDate',
    'pickupTime',
    'deliveryDate',
    'deliveryTime',
    'street',
    'latitude',
    'longitude',
    'firstName',
    'lastName',
    'phone',
    'email',
    'paymentMethod',
  ];

  const fd = formData as unknown as Record<string, unknown> | undefined;

  const allFieldsPresent =
    !!fd &&
    requiredKeys.every((k) => {
      const val = fd[k];
      return val !== undefined && val !== null && String(val).trim() !== '';
    });

  return allFieldsPresent && cart.length > 0;
};