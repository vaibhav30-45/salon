export default function Logo({ size = 40 }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative grid place-items-center rounded-full border border-gray-300 text-gray-900 shadow-sm"
        style={{ width: size, height: size }}
        aria-label="Inspiration Hair Studio logo"
      >
        <span className="font-display font-bold" style={{ fontSize: Math.max(14, size * 0.38) }}>
          <img
  src="/images/salonLOGO.png"
  alt="Logo"
  className="h-11 w-11 rounded-full object-cover"
/>
        </span>
      </div>
      <div className="leading-tight select-none">
        <div className="font-display text-lg font-semibold tracking-wide"><span className="text-brand">Inspiration</span> Saloon</div>
        <div className="text-xs text-gray-500">Hair • Beauty • Grooming</div>
      </div>
    </div>
  )
}





