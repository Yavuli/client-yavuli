"use client"

import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

type ToastData = {
  id: number
  title?: string
  description?: string
  duration?: number
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  // Helper to add a toast
  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Date.now() // simple unique id
    setToasts((prev) => [...prev, { id, ...toast }])
    // Auto-remove after duration or 3s default
    const duration = toast.duration ?? 3000
    setTimeout(() => removeToast(id), duration)
  }

  // Remove toast by id
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description }) => (
        <Toast key={id}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose onClick={() => removeToast(id)} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
