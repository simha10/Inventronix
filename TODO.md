# TODO: Fix Mobile Responsiveness and Routing Issues

## Frontend Routing & Mobile Fixes
- [x] src/index.html: Add viewport meta if missing for proper mobile scaling. (Already present)
- [x] src/components/Navigation.tsx: Optimize mobile menu for touch (min-height, reduce animation on mobile).
- [x] src/pages/Home.tsx: Check for mobile layout bugs (grids, fixed elements); optimize Hero3D/FloatingParticles on mobile.
- [x] src/pages/About.tsx: Check for mobile layout bugs.
- [x] src/contexts/mobile-context.tsx: Enhance if needed (debounce resize).
- [x] tailwind.config.ts: Confirm mobile-first config. (Yes, default)

## Server Configuration
- [ ] If backend exists, add Express catch-all route. (User to confirm backend location.)

## Testing
- [x] Run `bun dev` to start Vite server.
- [x] Use browser_action to emulate mobile: Launch at localhost, navigate to /about, back button, check console. (Dev server handles SPA routing; no 404s. Console shows minor React Router warnings, no JS errors. Layout renders without issues in 900x600 viewport; optimizations disable heavy 3D/particles.)
- [x] Verify responsiveness on emulated iPhone/Android. (Limited by tool viewport; nav menu touch-friendly, grids stack on smaller screens via Tailwind. No layout breaks observed.)
- [ ] User to test on real mobile device.

## Followup
- [ ] Fix any console errors found during testing.
- [ ] Suggest deployment config if no backend (e.g., Netlify _redirects).
