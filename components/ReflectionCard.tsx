interface ReflectionCardProps {
  question: string
  answer: string
  onChange: (v: string) => void
  onSave: () => void
}

export default function ReflectionCard({ question, answer, onChange, onSave }: ReflectionCardProps) {
  return (
    <div className="bg-gp dark:bg-gray-800 rounded-2xl p-4">
      <p className="font-bold text-gd dark:text-gl text-sm mb-3">{question}</p>
      <textarea
        value={answer}
        onChange={e => onChange(e.target.value)}
        onBlur={onSave}
        placeholder="Write anything..."
        rows={3}
        className="inp resize-none"
      />
    </div>
  )
}
