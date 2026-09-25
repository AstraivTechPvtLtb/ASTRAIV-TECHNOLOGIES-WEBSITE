import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm hover:shadow-md active:bg-primary/90",
        enterprise:
          "bg-[#0B3D91] hover:bg-[#082d6c] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-sm hover:shadow-md border border-blue-900/20 dark:border-blue-400/30",
        outline:
          "border border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/5 text-foreground hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/25 shadow-xs",
        secondary:
          "bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 shadow-xs",
        ghost:
          "hover:bg-slate-100 hover:text-foreground dark:hover:bg-white/10 text-muted-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        link: "text-primary dark:text-blue-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-6 text-sm",
        xs: "h-8 gap-1 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-lg px-4 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 sm:h-13 gap-2 px-8 text-sm sm:text-base font-bold",
        icon: "size-10 rounded-xl",
        "icon-xs": "size-8 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
