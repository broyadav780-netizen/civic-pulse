const styles = { 'Reported': 'bg-sky-100 text-sky-700', 'In Progress': 'bg-amber-100 text-amber-700', Resolved: 'bg-emerald-100 text-emerald-700', High: 'bg-rose-100 text-rose-700', Medium: 'bg-orange-100 text-orange-700', Low: 'bg-slate-100 text-slate-700' }
export function StatusBadge({ status }) { return <span className={`badge ${styles[status]}`}>{status}</span> }
export function PriorityBadge({ priority }) { return <span className={`badge ${styles[priority]}`}>{priority} priority</span> }
