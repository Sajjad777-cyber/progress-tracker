# ProgressOS design system

ProgressOS uses a token-first visual system for light and dark themes. Tokens live in `src/app/globals.css`; screens should consume them through CSS variables or the shared surface classes rather than introducing page-specific colors.

## Themes

- Light: warm neutral background, white elevated surfaces, violet primary action, blue informational data, emerald success, amber warning, red error.
- Dark: midnight navy background, violet-tinted elevated surfaces, softened borders, and the same semantic accents adjusted for contrast.
- Theme preference is stored in `localStorage` under `progressos-theme`.
- When no preference exists, the root layout respects the system color scheme before hydration.

## Shared primitives

- `.surface-card`: restrained bordered surface for repeated content.
- `.surface-raised`: elevated panel for important content or focused workflows.
- `.glass-surface`: selective frosted surface for layered navigation or contextual panels.
- `.interactive-lift`: subtle hover elevation for clickable cards.
- `.metric-value`: tabular-number treatment for statistics.
- `ThemeToggle`: accessible persistent light/dark control in the application shell.

## Usage guidance

Use `--surface`, `--surface-raised`, and `--surface-muted` for materials. Use `--primary`, `--info`, `--success`, `--warning`, and `--danger` for semantic meaning. Prefer `--success-soft`, `--info-soft`, and `--warning-soft` for tinted backgrounds. Avoid hardcoded color values in new components.

Keep text contrast high on glass and dimensional surfaces. Preserve visible focus rings, keyboard navigation, reduced-motion behavior, and mobile layouts when extending the system.