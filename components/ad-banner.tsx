interface AdBannerProps {
  type: "inline" | "sidebar"
  className?: string
}

export function AdBanner({ type, className }: AdBannerProps) {
  return (
    <div
      className={`bg-gray-100 border rounded-lg flex items-center justify-center ${
        type === "inline" ? "h-24 mb-4" : "h-[600px] w-[160px] sticky top-4"
      } ${className}`}
    >
      <div className="text-sm text-gray-400">
        Advertisement
        {type === "sidebar" && <div className="text-xs">160 x 600</div>}
        {type === "inline" && <div className="text-xs">728 x 90</div>}
      </div>
    </div>
  )
}
