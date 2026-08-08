"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast p-6 text-lg border-2 shadow-2xl rounded-2xl min-h-[80px]",
          title: "text-lg font-bold",
          description: "text-base mt-1",
          actionButton: "bg-primary text-primary-foreground text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors",
          cancelButton: "bg-muted text-muted-foreground text-sm font-bold px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
