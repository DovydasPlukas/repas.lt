export interface Service {
  id: string;
  name: string;
  description?: string;
  addons: Addon[];
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  type: string;
}

export interface CartItem {
  serviceId: string;
  serviceName: string;
  addons: Array<{
    addonId: string;
    addonName: string;
    addonPrice: number;
  }>;
  specialRequirements: string;
}

export interface ServiceSelectionProps {
  onAddService: (service: Service, addons: Array<{ addonId: string; addonName: string; addonPrice: number }>, requirements: string) => void;
  onEditService: (cartIndex: number, addons: Array<{ addonId: string; addonName: string; addonPrice: number }>, requirements: string) => void;
  onRemoveService: (cartIndex: number) => void;
  cart: CartItem[];
}

export interface ServiceSelectionHandle {
  openEditDialog: (cartIndex: number) => void;
}

export interface ServiceConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedService: Service | null;
  tempAddons: Array<{ addonId: string; addonName: string; addonPrice: number }>;
  tempRequirements: string;
  editingCartIndex: number | null;
  onAddonToggle: (addon: Addon) => void;
  onRequirementsChange: (value: string) => void;
  onConfirm: () => void;
}

export interface FormData {
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  zipCode: string;
  city: string;
  street: string;
  houseNumber: string;
  notes: string;
  firstName: string;
  lastName: string;
  phone: string;
  paymentMethod: string;
  latitude: string;
  longitude: string;
}

export interface PickupDeliveryTimeProps {
  formData: {
    pickupDate: string;
    pickupTime: string;
    deliveryDate: string;
    deliveryTime: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

export interface AddressSelectionProps {
  formData: {
    zipCode: string;
    city: string;
    street: string;
    houseNumber: string;
    notes: string;
    latitude: string;
    longitude: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

export interface ContactsInfoProps {
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

export interface OrderOverviewProps {
  cart: CartItem[];
  formData: {
    pickupDate: string;
    pickupTime: string;
    deliveryDate: string;
    deliveryTime: string;
    street: string;
    houseNumber: string;
    city: string;
    zipCode: string;
    notes: string;
    firstName: string;
    lastName: string;
    phone: string;
    paymentMethod: string;
  };
  totalPrice: number;
  onFormDataChange?: (field: string, value: string) => void;
}

export interface OrderSummaryProps {
  cart: CartItem[];
  totalPrice: number;
  formData?: {
    pickupDate: string;
    pickupTime: string;
    deliveryDate: string;
    deliveryTime: string;
    street: string;
    houseNumber: string;
    city: string;
    zipCode: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  onEditService?: (cartIndex: number) => void;
  onRemoveService?: (cartIndex: number) => void;
}