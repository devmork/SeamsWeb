import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold tracking-[0.125px] whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-surface text-primary ring-1 ring-hairline",
        secondary: "bg-canvas-soft text-ink-secondary ring-1 ring-hairline",
        outline: "border-hairline bg-surface text-ink-secondary ring-1 ring-hairline",
        ghost: "bg-canvas-soft text-ink-secondary",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-sticker-green-tint text-sticker-green-ink ring-1 ring-sticker-green/25",
        warning:
          "bg-sticker-orange-tint text-sticker-orange-ink ring-1 ring-sticker-orange/25",
        danger: "bg-destructive/10 text-destructive-ink ring-1 ring-destructive/20",
        info: "bg-sticker-sky-tint text-sticker-sky-ink ring-1 ring-sticker-sky/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
