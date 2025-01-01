interface StatusBadgeProps {
  status: "upcoming" | "ongoing" | "finished";
}

export function StatusBadge({status}: StatusBadgeProps) {
  const styles = {
    upcoming: "bg-blue-50 text-blue-700 border-blue-100",
    ongoing: "bg-green-50 text-green-700 border-green-100",
    finished: "bg-yellow-50 text-yellow-700 border-yellow-100",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  );
}
