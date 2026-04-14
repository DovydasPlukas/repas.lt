## Directory Structure

```
(checkout)/
├── lib/
│   ├── types.ts                      # OrderAddon, OrderService, OrderDetails
│   └── constants.ts                  # statusOptions
├── utils/
│   ├── formatters.ts                 # formatDate, formatDateTime, formatTime, formatRange
│   └── order.ts                      # getStatusLabel, calculateTotalPrice
...
/order                                # Order page (view created orders)
/order-confirmation                   # order-confirmation page (thanks for buying page)
```