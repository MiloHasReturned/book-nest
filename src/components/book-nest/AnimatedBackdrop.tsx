import type { AppTheme } from '#/lib/booknest'

export function AnimatedBackdrop({
  theme,
  compact = false,
}: {
  theme: AppTheme
  compact?: boolean
}) {
  return (
    <div
      className={`animated-backdrop${compact ? ' animated-backdrop--compact' : ''}`}
      data-style={theme.animationStyle}
      aria-hidden="true"
    >
      <div className="animated-backdrop__base" />
      <div className="animated-backdrop__layer animated-backdrop__layer--1" />
      <div className="animated-backdrop__layer animated-backdrop__layer--2" />
      <div className="animated-backdrop__layer animated-backdrop__layer--3" />
      <div className="animated-backdrop__layer animated-backdrop__layer--4" />
      <div className="animated-backdrop__layer animated-backdrop__layer--5" />
      <div className="animated-backdrop__grid" />
      <div className="animated-backdrop__sparkles" />
    </div>
  )
}
