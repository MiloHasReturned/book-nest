import { createFileRoute } from '@tanstack/react-router'
import { BookNestDashboard } from '#/components/book-nest/Dashboard'

export const Route = createFileRoute('/')({
  component: BookNestDashboard,
})
