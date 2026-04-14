## Directory Structure

```
order/
├── page.tsx                       # thin shell,
├── hooks/
│   └── useOrders.ts               # fetch list + openModal + fetchFullOrder
└── components/
    ├── LoadingState.tsx
    ├── ErrorState.tsx             # unauthenticated yellow warning + login link
    ├── OrdersHero.tsx             # blue hero banner
    ├── OrderCard.tsx              # single clickable order row
    ├── OrdersList.tsx             # list + empty state
    └── OrderDetailModal.tsx       # full Dialog with all order details
```