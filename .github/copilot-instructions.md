# Apparel Store - AI Coding Guidelines

## Architecture Overview
This is an Angular 20 standalone e-commerce app with an Express.js backend. The frontend handles product display, cart management, and Stripe checkout, while the backend processes payments and sends notifications.

**Key Components:**
- **Frontend:** Angular standalone components with signals for reactive state
- **Backend:** Express API with Stripe integration, Twilio SMS, and Mailjet email
- **Data Flow:** Products loaded from `src/assets/products.json`, cart state managed in-memory with Angular signals
- **Routing:** Landing → Products → Cart → Checkout flow

## Development Workflows
- **Start Frontend:** `ng serve` (proxies `/api` to `localhost:4000`)
- **Start Backend:** `cd express-api && npm start` (runs with ts-node)
- **Build:** `ng build` (outputs to `dist/`)
- **Test:** `ng test` (Karma runner)
- **Format:** Prettier with single quotes, 100 char width, Angular HTML parser

## Code Patterns
### State Management
Use Angular signals for reactive state (see `CartService` and `ModalService`):
```typescript
private items = signal<CartItem[]>([]);
readonly cartItems = this.items.asReadonly();
readonly total = computed(() => this.items().reduce(...));
```

### Component Structure
- **Standalone components** with `inject()` for DI
- **Async pipe** for observables: `products$ = this.productService.getAll()`
- **Input bindings** for data flow

### Product Handling
Products have optional `sizes` and `colors` arrays. Always validate size selection before adding to cart:
```typescript
if (this.product.sizes && !this.selectedSize) {
  alert('Please select a size.');
  return;
}
```

### API Integration
- Frontend proxies `/api` requests to Express backend
- Checkout sends cart items to `/api/checkout` for Stripe session creation
- Use `HttpClient` with `withFetch()` provider

## File Organization
- **Models:** `src/app/core/models/` (e.g., `product.model.ts`)
- **Services:** `src/app/core/services/` (injected at root)
- **Pages:** `src/app/pages/` (route components)
- **UI Components:** `src/app/ui/` (reusable components like `product-card`)
- **Assets:** `src/assets/products.json` for product data

## Dependencies & Integrations
- **Stripe:** Payment processing via `@stripe/stripe-js` and backend API
- **Rive:** Canvas animations in `rive-player` component
- **Angular Material:** UI components
- **Bootstrap Icons:** Icon library

## Conventions
- **Prefix:** `app-` for component selectors
- **Styles:** SCSS with component-level stylesheets
- **Naming:** Kebab-case for files/directories, PascalCase for classes
- **Imports:** Use `inject()` instead of constructor DI in standalone components