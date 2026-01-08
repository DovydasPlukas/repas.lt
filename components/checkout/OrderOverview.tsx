'use client';

import React, { useState } from 'react';
import {
  Check,
  XCircle,
  NotepadText,
  CreditCard,
  Euro,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { OrderOverviewProps } from '@/components/checkout/types';

/**
 * Local "duck" types to avoid using `any` and satisfy ESLint.
 */
type LocalAddon = {
  addonId?: string;
  addonName?: string;
  addonPrice?: number;
  id?: string;
  name?: string;
  price?: number;
};

type LocalCartItem = {
  serviceId?: string;
  serviceName?: string;
  servicePrice?: number;
  price?: number;
  service?: { name?: string; price?: number };
  addons?: LocalAddon[];
  specialRequirements?: string;
};

type FormDataRaw = OrderOverviewProps['formData'];

const OrderOverview: React.FC<OrderOverviewProps> = ({
  cart,
  formData,
  totalPrice,
  onFormDataChange,
}) => {
  const [showAllServices, setShowAllServices] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Record<number, boolean>>(
    {}
  );

  // Requirements dialog state
  const [reqDialogOpen, setReqDialogOpen] = useState(false);
  const [reqDialogText, setReqDialogText] = useState('');
  const [reqDialogTitle, setReqDialogTitle] = useState('');

  // Notes dialog state (for "Pastabos")
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesDialogText, setNotesDialogText] = useState('');
  const [notesDialogTitle, setNotesDialogTitle] = useState('');

  // Cast the incoming cart to our local shape (no `any`)
  const typedCart = (cart as unknown as LocalCartItem[]) ?? [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const displayedServices = showAllServices ? typedCart : typedCart.slice(0, 3);

  const toggleServiceExpanded = (idx: number) => {
    setExpandedServices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const openRequirements = (serviceName?: string, text?: string) => {
    setReqDialogTitle(serviceName ?? '');
    setReqDialogText(text || 'Nėra specialių reikalavimų');
    setReqDialogOpen(true);
  };

  const openNotes = (title?: string, text?: string) => {
    setNotesDialogTitle(title ?? 'Pastabos');
    setNotesDialogText(text || 'Nėra pastabų');
    setNotesDialogOpen(true);
  };

  const getServiceBasePrice = (item?: LocalCartItem) =>
    item?.servicePrice ?? item?.price ?? item?.service?.price ?? 0;

  const getAddonPrice = (addon?: LocalAddon) =>
    addon?.addonPrice ?? addon?.price ?? 0;

  const getAddonName = (addon?: LocalAddon) =>
    addon?.addonName ?? addon?.name ?? 'Priedas';

  const getServiceName = (item?: LocalCartItem) =>
    item?.serviceName ?? item?.service?.name ?? 'Paslauga';

  const serviceTotal = (item?: LocalCartItem) => {
    const base = getServiceBasePrice(item);
    const addonsSum = Array.isArray(item?.addons)
      ? item!.addons!.reduce((s, a) => s + getAddonPrice(a), 0)
      : 0;
    return base + addonsSum;
  };

  // Basic completeness check for required data
  const isFormComplete = (() => {
    const requiredKeys: Array<keyof FormDataRaw | string> = [
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
        const val = fd[k as string];
        return val !== undefined && val !== null && String(val).trim() !== '';
      });

    const hasService = typedCart.length > 0;

    return allFieldsPresent && hasService;
  })();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isFormComplete ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <h2 className="text-2xl font-semibold text-gray-900">Peržiūrėkite užsakymą</h2>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Left column (services + total) */}
        <div className="space-y-4">
          {/* Services Overview */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900">Paslaugos</h3>
            </div>

            {typedCart.length === 0 ? (
              <p className="text-sm text-gray-600">Jūs dar nepridėjote paslaugų</p>
            ) : (
              <div className="space-y-3">
                {displayedServices.map((item, index) => {
                  const isExpanded = !!expandedServices[index];
                  const addons = Array.isArray(item.addons) ? item.addons : [];
                  const showCount = isExpanded ? addons.length : Math.min(2, addons.length);

                  return (
                    <div
                      key={index}
                      className="rounded border-l-4 border-[--RepasBlue] bg-blue-50 p-3"
                    >
                      {/* Use grid so right column (prices) stays right on all screens */}
                      <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                        {/* Left column: title + addon names + requirements preview */}
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {getServiceName(item)}
                          </h4>

                          {/* addon names */}
                          {addons.length > 0 && (
                            <div className="mt-2 space-y-1 text-sm text-gray-700">
                              {addons.slice(0, showCount).map((addon, aIdx) => (
                                <div
                                  key={addon.addonId ?? addon.id ?? aIdx}
                                  className="truncate"
                                >
                                  • {getAddonName(addon)}
                                </div>
                              ))}

                              {/* "+N daugiau" / "Mažiau" control */}
                              {addons.length > 2 && (
                                <div>
                                  <button
                                    onClick={() => toggleServiceExpanded(index)}
                                    className="mt-1 inline-flex items-center text-xs text-[--RepasBlue] hover:underline"
                                    aria-expanded={isExpanded}
                                  >
                                    {isExpanded ? 'Mažiau' : `+${addons.length - 2} daugiau`}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* special requirements preview + dialog trigger */}
                          {item.specialRequirements && (
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={() =>
                                  openRequirements(getServiceName(item), item.specialRequirements)
                                }
                                className="p-1 rounded hover:bg-gray-100"
                                aria-label="Peržiūrėti specialius reikalavimus"
                              >
                                <NotepadText className="h-4 w-4 text-[--RepasBlue]" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Right column: sum (prominent) + addon prices stacked under it */}
                        <div className="flex flex-col items-end">
                          <div className="text-lg font-bold text-gray-900">
                            €{serviceTotal(item).toFixed(2)}
                          </div>

                          {/* addon prices (show same slice as names) */}
                          {addons.length > 0 && (
                            <div className="mt-2 flex flex-col items-end gap-1">
                              {addons
                                .slice(0, isExpanded ? addons.length : Math.min(2, addons.length))
                                .map((addon, aIdx) => (
                                  <div
                                    key={addon.addonId ?? addon.id ?? aIdx}
                                    className="text-xs font-medium text-gray-700"
                                  >
                                    €{getAddonPrice(addon).toFixed(2)}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* expand services list */}
                {typedCart.length > 3 && (
                  <div className="pt-1">
                    <button
                      onClick={() => setShowAllServices((s) => !s)}
                      className="text-sm text-[--RepasBlue] hover:underline"
                    >
                      {showAllServices ? 'Rodyti mažiau' : `Rodyti viską (${typedCart.length})`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Total Price */}
          <div className="rounded-lg border-2 border-[--RepasBlue] bg-blue-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-sm font-medium text-gray-900">Bendras kainą:</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[--RepasBlue]">
                  €{(totalPrice ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (pickup/delivery/address/contacts/payment) */}
        <div className="space-y-4">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {/* Pickup */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                {formData?.pickupDate && formData?.pickupTime ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <h3 className="text-sm font-medium text-gray-900">Paėmimas</h3>
              </div>
              <div className="text-sm text-gray-700">
                <div>
                  <p className="text-xs text-gray-600">Data</p>
                  <p className="font-medium">{formatDate(formData?.pickupDate)}</p>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-gray-600">Laikas</p>
                  <p className="font-medium">{formData?.pickupTime}</p>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                {formData?.deliveryDate && formData?.deliveryTime ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <h3 className="text-sm font-medium text-gray-900">Pristatymas</h3>
              </div>
              <div className="text-sm text-gray-700">
                <div>
                  <p className="text-xs text-gray-600">Data</p>
                  <p className="font-medium">{formatDate(formData?.deliveryDate)}</p>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-gray-600">Laikas</p>
                  <p className="font-medium">{formData?.deliveryTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address (with notes preview + dialog trigger) */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              {formData?.street ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h3 className="text-sm font-medium text-gray-900">Adresas</h3>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Gatvė</span>
                <span className="font-medium text-gray-900">{formData?.street}</span>
              </div>
              {formData?.apartment && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">butas</span>
                <span className="font-medium text-gray-900">{formData?.apartment}</span>
              </div>
              )}
              {formData?.floor && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Aukštas</span>
                <span className="font-medium text-gray-900">{formData?.floor}</span>
              </div>
              )}

              {formData?.notes && (
                <div className="mt-1 flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Pastabos</p>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={() => openNotes('Pastabos — adresas', formData.notes)}
                      className="text-xs text-[--RepasBlue] hover:underline rounded"
                    >
                      Peržiūrėti
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contacts */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              {formData?.firstName && formData?.lastName && formData?.phone ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h3 className="text-sm font-medium text-gray-900">Kontaktai</h3>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Vardas</span>
                <span className="font-medium text-gray-900">{formData?.firstName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Pavardė</span>
                <span className="font-medium text-gray-900">{formData?.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Telefonas</span>
                <span className="font-medium text-gray-900">{formData?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">El. paštas</span>
                <span className="font-medium text-gray-900">{formData?.email}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              {formData?.paymentMethod ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h3 className="text-sm font-medium text-gray-900">Mokėjimo būdas *</h3>
            </div>

            <div role="radiogroup" className="flex flex-col sm:flex-row gap-3">
              {[
                { id: 'paysera', label: 'Paysera', Icon: CreditCard, disabled: true },
                { id: 'cash', label: 'Grynais pinigais', Icon: Euro, disabled: false },
              ].map((m) => {
                const selected = formData?.paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    role="radio"
                    aria-checked={selected}
                    disabled={m.disabled}
                    onClick={() => !m.disabled && onFormDataChange?.('paymentMethod', m.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg border focus:outline-none ${
                      m.disabled
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                        : selected
                        ? 'bg-[--RepasBlue] text-white ring-2 ring-offset-2 ring-[--RepasBlue]'
                        : 'bg-white text-gray-900 border-gray-200'
                    }`}
                  >
                    <m.Icon
                      className={`h-5 w-5 ${
                        m.disabled
                          ? 'text-gray-400'
                          : selected
                          ? 'text-white'
                          : 'text-[--RepasBlue]'
                      }`}
                    />
                    <span className="text-sm font-medium">{m.label}</span>
                    {m.disabled && <span className="text-xs font-medium">(Neprieinama)</span>}
                  </button>
                );
              })}
            </div>

            {!formData?.paymentMethod && (
              <p className="mt-3 text-sm text-red-600 font-medium">
                Prašome pasirinkti mokėjimo būdą
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Requirements Dialog */}
      <Dialog open={reqDialogOpen} onOpenChange={setReqDialogOpen}>
        <DialogContent className="w-full max-w-[90vw] sm:max-w-lg max-h-[70vh]">
          <DialogHeader>
            <DialogTitle className="text-sm">
              Specialūs reikalavimai — {reqDialogTitle}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[48vh] overflow-y-auto py-2 text-sm text-gray-700 break-words whitespace-pre-wrap">
            {reqDialogText}
          </div>

          <DialogFooter>
            <button
              onClick={() => setReqDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50"
            >
              Uždaryti
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog (Pastabos) */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="w-full max-w-[90vw] sm:max-w-lg max-h-[70vh]">
          <DialogHeader>
            <DialogTitle className="text-sm">{notesDialogTitle}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[48vh] overflow-y-auto py-2 text-sm text-gray-700 break-words whitespace-pre-wrap">
            {notesDialogText}
          </div>

          <DialogFooter>
            <button
              onClick={() => setNotesDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50"
            >
              Uždaryti
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderOverview;