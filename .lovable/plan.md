

## Problem Analysis

The sidebar scroll resets on every navigation because:

1. **Routes use `key={location.pathname}`** in `AnimatedRoutes.tsx` (line 116), causing full unmount/remount on every navigation
2. **Each admin page wraps itself in `<AdminLayout>`**, which contains `<AdminSidebar>` — so the sidebar is destroyed and recreated on every route change
3. The current `useRef` for scroll position is **component-local** — it gets destroyed when the component unmounts, so the saved value is always lost

## Solution

Two changes are needed:

### 1. Store scroll position in a module-level variable (AdminSidebar.tsx)

Move `savedScrollTop` outside the component so it persists across mount/unmount cycles. Then use a `useLayoutEffect` triggered by `location.pathname` to restore the scroll position after each re-mount.

```text
// Module-level (outside component)
let _savedScrollTop = 0;

// Inside component:
// - onScroll: save to _savedScrollTop
// - useLayoutEffect([location.pathname]): restore scrollTop from _savedScrollTop
// - Remove the callback ref approach, use a simple useRef + useEffect instead
```

### 2. Prevent AnimatePresence from keying on admin routes (AnimatedRoutes.tsx)

The `key={location.pathname}` forces full remount of every route. For admin routes, we should use a stable key so React doesn't unmount the layout:

- Change the key to use a stable value for `/admin/*` routes (e.g. always `"admin"`) so the `AdminLayout` component tree is preserved across admin sub-navigations
- This is the proper fix — the sidebar DOM element stays alive, no scroll restoration needed

**Recommended approach**: Combine both — stable key for admin routes (primary fix) + module-level scroll backup (safety net).

### Files to modify
- `src/components/AnimatedRoutes.tsx` — use stable key for admin route group
- `src/components/admin/AdminSidebar.tsx` — module-level scroll position storage as fallback

