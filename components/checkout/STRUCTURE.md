# Checkout Components Structure

This document outlines the organized structure of checkout-related components for better maintainability and scalability.

## Directory Structure

```
components/
└── checkout/
    ├── types.ts                          # Shared TypeScript interfaces & types
    ├── STRUCTURE.md                      # This file
    │
    ├── AddressSelection.tsx              # Address input with map integration
    ├── ContactsInfo.tsx                  # Contact information form
    ├── OrderSummary.tsx                  # Sticky summary sidebar
    ├── ServiceSelectionModal.tsx         # Modal wrapper for service selection
    │
    ├── OrderOverview.tsx                 # Order review & validation (main component)
    ├── OrderOverview/
    │   ├── overview-utils.ts             # Utility functions for order calculation & formatting
    │   ├── TextViewDialog.tsx            # Dialog for viewing requirements/notes
    │   ├── ServicesPanel.tsx             # Services list panel with expandable items
    │   ├── ServiceCard.tsx               # Individual service display with addons
    │   ├── DateTimeCard.tsx              # Pickup/delivery date and time display
    │   ├── FormDataPanel.tsx             # Right column panel for form fields display
    │   ├── AddressCard.tsx               # Address information card
    │   ├── ContactsCard.tsx              # Contact details card
    │   └── PaymentCard.tsx               # Payment method selector card
    │
    ├── PickupDeliveryTime.tsx            # Main component for pickup/delivery scheduling
    ├── PickupDeliveryTime/
    │   ├── time-utils.ts                 # Time calculation & formatting utilities
    │   │                                  # Functions: generateTimeRanges(), toISODate(), parseDateTime(), slotKey()
    │   └── TimeSlotSelect.tsx            # Date/time selector subcomponent
    │
    ├── ServiceConfigDialog.tsx           # Main dialog for service addon configuration
    ├── ServiceConfigDialog/
    │   ├── AddonTypeGroup.tsx            # Addon checkboxes grouped by type
    │   └── RequirementsInput.tsx         # Special requirements textarea input
    │
    ├── ServiceSelection.tsx              # Main component for browsing services
    └── ServiceSelection/
        └── ServiceCard.tsx               # Service grid item display
```

## Component Descriptions

### Root Level Components

#### `types.ts`
Centralized location for all TypeScript interfaces used across checkout components:
- `Service`, `Addon` - Data models
- `CartItem` - Shopping cart item structure
- `FormData` - Checkout form fields
- Component-specific props interfaces

#### `AddressSelection.tsx`
**Purpose:** Collect delivery address with map integration.
- Address autocomplete input
- Map component integration
- Latitude/longitude coordinate capture
- Loads previously saved address on mount

#### `ContactsInfo.tsx`
**Purpose:** Collect customer contact details.
- Email validation
- Phone number validation (Lithuanian format: +370XXXXXXXX)
- First name and last name inputs

#### `OrderSummary.tsx`
**Purpose:** Sticky sidebar showing order total and editable items.
- Service list with prices
- Total price calculation
- Edit/delete service buttons
- Displays pickup, delivery, address, and contact summary

#### `ServiceSelectionModal.tsx`
**Purpose:** Modal wrapper for adding services from other pages.
- Handles navigation to checkout page
- localStorage integration for cart persistence
- Loading and processing states

### OrderOverview Component (`OrderOverview.tsx` + `OrderOverview/`)

**Purpose:** Review complete order before submission with comprehensive UI panels.

#### Main Component (`OrderOverview.tsx`)
- Orchestrates all subcomponents
- Manages form validation state
- Handles checkout step progression

#### Subcomponents:
- **`ServicesPanel.tsx`** - Services list with expandable addon details
- **`ServiceCard.tsx`** - Individual service with addons and expandable sections
- **`DateTimeCard.tsx`** - Displays formatted pickup/delivery dates and times
- **`AddressCard.tsx`** - Address section with street, apartment, floor display
- **`ContactsCard.tsx`** - Contact details section
- **`PaymentCard.tsx`** - Payment method selection (Stripe/Cash)
- **`FormDataPanel.tsx`** - Right column container for form display
- **`TextViewDialog.tsx`** - Modal dialog for viewing full requirements/notes text

#### Utilities:
- **`overview-utils.ts`** - Helper functions for:
  - Service total calculation with addons
  - Currency formatting
  - Data extraction and transformation

### PickupDeliveryTime Component (`PickupDeliveryTime.tsx` + `PickupDeliveryTime/`)

**Purpose:** Select pickup and delivery dates/times with availability checking.

#### Main Component (`PickupDeliveryTime.tsx`)
- Date validation (delivery must be after pickup)
- State management for date/time selections
- Loading and error handling

#### Subcomponents:
- **`TimeSlotSelect.tsx`** - Date picker + time selector UI component

#### Utilities:
- **`time-utils.ts`** - Time handling functions:
  - `generateTimeRanges()` - Creates 08:00-18:00 time slots
  - `toISODate()` - Converts Date to YYYY-MM-DD format
  - `parseDateTime()` - Parses date + time range for comparison
  - `slotKey()` - Creates unique slot identifiers

### ServiceConfigDialog Component (`ServiceConfigDialog.tsx` + `ServiceConfigDialog/`)

**Purpose:** Configure selected service with addons and special requirements.

#### Main Component (`ServiceConfigDialog.tsx`)
- Dialog wrapper managing addon selection
- Requirements input handling
- Confirmation logic

#### Subcomponents:
- **`AddonTypeGroup.tsx`** - Renders grouped addon checkboxes by type
- **`RequirementsInput.tsx`** - Special requirements/notes textarea input

### ServiceSelection Component (`ServiceSelection.tsx` + `ServiceSelection/`)

**Purpose:** Browse and add services to cart.

#### Main Component (`ServiceSelection.tsx`)
- Service fetching and loading
- Dialog state management
- Cart operations (add/edit/remove)

#### Subcomponents:
- **`ServiceCard.tsx`** - Service grid item with image, name, description, and action button

## Import Patterns

All components should import from the centralized `types.ts`:

```tsx
import type { Service, CartItem, PickupDeliveryTimeProps } from '@/components/checkout/types';
```

Subcomponents should import only what they need:

```tsx
import TextViewDialog from './TextViewDialog';
import { formatCurrency } from './overview-utils';
import { generateTimeRanges } from './time-utils';
```

## State Management

- **FormData**: Passed down via props and managed in parent page component
- **Cart**: Stored in localStorage for persistence across navigation
- **Local States**: Dialog opens, expansions, validation errors are managed locally
- **Validation**: Each component validates its own inputs before parent submission

## Adding New Features

### To add a new subcomponent:
1. Create new file in appropriate folder (e.g., `OrderOverview/NewCard.tsx`)
2. Keep it focused on single responsibility
3. Export props interface
4. Import and use in parent/orchestrator component

### To modify existing structure:
1. Check all imports across files
2. Update `types.ts` if interfaces change
3. Test component in isolation first
4. Update this STRUCTURE.md document

## **TODO**

- PickupDeliveryTime check if available time before payment.
- Stripe payment.
- ContactsInfo.tsx (fizinis ar juridinis asmuo).
- Updates to database (fizinis ar juridinis asmuo)
- Stepper going to already filled forms.