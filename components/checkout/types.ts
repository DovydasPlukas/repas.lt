// pricing metadata for OPTION addons
export interface AddonRange {
  id: string;
  minQty: number;
  maxQty: number;
  price: number;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  position?: number;
  addons: Addon[];
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  type: string;
  optionPricingType?: 'FIXED' | 'QUANTITY' | 'RANGE';
  ranges?: AddonRange[];   // populated only when optionPricingType === 'RANGE'
}

export interface CartItem {
  serviceId: string;
  serviceName: string;
  addons: Array<{
    addonId: string;
    addonName: string;
    addonPrice: number;
    addonQty?: number;
    addonUnit?: string;
  }>;
  specialRequirements: string;
}

export interface ServiceSelectionProps {
  onAddService: (
    service: Service,
    addons: Array<{ addonId: string; addonName: string; addonPrice: number; addonQty?: number; addonUnit?: string }>,
    requirements: string
  ) => void;
  onEditService: (
    cartIndex: number,
    addons: Array<{ addonId: string; addonName: string; addonPrice: number; addonQty?: number; addonUnit?: string }>,
    requirements: string
  ) => void;
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
  tempAddons: Array<{ addonId: string; addonName: string; addonPrice: number; addonQty?: number; addonUnit?: string }>;
  tempRequirements: string;
  editingCartIndex: number | null;
  onAddonToggle: (addon: Addon, action?: 'toggle' | 'update' | 'remove', qty?: number, unit?: string) => void;
  onRequirementsChange: (value: string) => void;
  onConfirm: () => void;
}

export interface FormData {
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  street: string;
  apartment: string;
  floor: string;
  notes: string;
  email: string;
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
    street: string;
    apartment: string;
    floor: string;
    notes: string;
    latitude: string;
    longitude: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

export interface ContactsInfoProps {
  formData: {
    email: string;
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
    apartment: string;
    floor: string;
    notes: string;
    email: string;
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
    apartment: string;
    floor: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  onEditService?: (cartIndex: number) => void;
  onRemoveService?: (cartIndex: number) => void;
}