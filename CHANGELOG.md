# Changelog

## 2.0.2

- Keep built-in prompt input spacing separate from custom template layout so padded wrappers and full-width utility classes do not cause overflow.
- Add ESM/CommonJS entrypoints, SSR-safe imports and construction, CSS exports, and TypeScript declarations while retaining UMD browser bundles.
- Unify dismissal/destruction cleanup, stop existing queues on destruction, and ignore late validation completions.
- Coordinate modal focus, background isolation, scrolling, toast stacking, and native-dialog installation across instances and module formats.
- Fix prompt defaults, template textarea switching, native constraints, visible validation, duplicate async submissions, and connected lifecycle events.
- Supply built-in close buttons and timer bars, constrain long dialogs, preserve explicit zero/empty options, and respect reduced motion.
- Add unit, browser, accessibility, and packed-consumer regression checks and Node 22/24 CI release gates.
- Update build dependencies and lockfile to clear reported advisories. No runtime dependencies were added.
