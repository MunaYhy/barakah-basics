import { formatTime } from '@/lib/dates'

interface FeedEntry {
  id: string
  logged_at: string
}

interface FeedLogProps {
  feeds: FeedEntry[]
  onAdd: () => void
}

export default function FeedLog({ feeds, onAdd }: FeedLogProps) {
  const last = feeds[0]
  return (
    <div className="text-center">
      <button
        onClick={onAdd}
        className="w-full py-4 rounded-2xl bg-gm text-white font-extrabold text-lg active:scale-95 transition-transform"
      >
        + Log Feed
      </button>
      {feeds.length > 0 && (
        <p className="mt-2 text-sm text-inks dark:text-gray-400 font-semibold">
          {feeds.length} feed{feeds.length !== 1 ? 's' : ''} today
          {last && ` · Last at ${formatTime(last.logged_at)}`}
        </p>
      )}
      {feeds.length === 0 && (
        <p className="mt-2 text-xs text-inks/50 dark:text-gray-600 font-semibold">No feeds logged yet today</p>
      )}
    </div>
  )
}
