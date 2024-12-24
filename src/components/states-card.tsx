interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  emoji: string;
}

export function StatsCard({title, value, change, emoji}: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <p className="text-base font-medium text-muted-foreground">{title}</p>
          <span role="img" aria-label={title} className="text-2xl">
            {emoji}
          </span>
        </div>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{change}</p>
      </div>
    </div>
  );
}
