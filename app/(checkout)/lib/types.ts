export type OrderAddon = {
  id: string;
  addonId: string;
  snapPrice?: string | null;
  snapName?: string | null;
};

export type OrderService = {
  id: string;
  serviceId: string;
  service?: { id: string; name?: string } | null;
  specialRequirements?: string | null;
  orderAddons?: OrderAddon[] | null;
};

export type OrderDetails = {
  id: string;
  orderNumber: string;
  snapFirstName: string;
  snapLastName: string;
  snapPhone: string;
  snapEmail?: string | null;
  snapStreet?: string | null;
  snapApartment?: string | null;
  snapFloor?: string | null;
  snapNotes?: string | null;
  pickupStart?: string | null;
  pickupEnd?: string | null;
  deliveryStart?: string | null;
  deliveryEnd?: string | null;
  pickupDateTime?: string | null;
  deliveryDateTime?: string | null;
  createdAt: string;
  status: string;
  orderServices?: OrderService[] | null;
};