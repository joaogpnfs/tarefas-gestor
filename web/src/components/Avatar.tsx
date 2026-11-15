import { cn } from '../lib/utils'
import { avatarColor, initials } from '../lib/ui'

export function Avatar({ name, size = 24, className, ring = false }: {
  name?: string | null
  size?: number
  className?: string
  ring?: boolean
}) {
  return (
    <span
      title={name ?? 'Sem responsável'}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white',
        ring && 'ring-2 ring-card',
        !name && 'border border-dashed border-muted-foreground/50 bg-transparent text-muted-foreground',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(9, Math.round(size * 0.4)),
        background: name ? avatarColor(name) : undefined,
      }}
    >
      {name ? initials(name) : '?'}
    </span>
  )
}

export function AvatarStack({ names, size = 24, max = 4 }: { names: string[]; size?: number; max?: number }) {
  const shown = names.slice(0, max)
  const rest = names.length - shown.length
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((n) => (
        <Avatar key={n} name={n} size={size} ring />
      ))}
      {rest > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-card"
          style={{ width: size, height: size }}
        >
          +{rest}
        </span>
      )}
    </div>
  )
}
