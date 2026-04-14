## Directory Structure

```
order-confirmation/
├── page.tsx                          # thin shell, just wires things together
├── hooks/
│   └── useOrderConfirmation.ts       # all fetch + Stripe logic + state
└── components/
    ├── LoadingState.tsx              # spinner (used in both Suspense fallback + hook state)
    ├── ErrorStates.tsx               # ErrorState + NotFoundState
    ├── SuccessBanner.tsx             # green check header section
    ├── OrderInfoGrid.tsx             # contact info + delivery address side-by-side
    ├── ServicesList.tsx              # services + addons list
    ├── OrderMeta.tsx                 # status, date, pickup/delivery times, total price
    └── ActionButtons.tsx             # "my orders" + "back to services" links
```