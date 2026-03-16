import { createFileRoute } from '@tanstack/react-router'
import { BookNestCalendarDetail } from '#/components/book-nest/CalendarDetail'

export const Route = createFileRoute('/calendar/$calendarId')({
  component: CalendarRoute,
})

function CalendarRoute() {
  const { calendarId } = Route.useParams()

  return <BookNestCalendarDetail calendarId={calendarId} />
}
