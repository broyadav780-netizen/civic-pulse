import { MapPin, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge, PriorityBadge } from './Badges'
export default function IssueCard({ issue }) { return <Link to={`/reports/${issue.id}`} className="card issue-card"><img src={issue.image} alt="Reported civic issue" /><div className="issue-content"><div className="row"><p className="eyebrow">{issue.id} · {issue.category}</p><ChevronRight size={18} /></div><h3>{issue.title}</h3><p className="muted location"><MapPin size={15}/>{issue.location}</p><div className="row"><div className="badges"><StatusBadge status={issue.status}/><PriorityBadge priority={issue.priority}/></div><span className="muted small">{issue.createdAt}</span></div></div></Link> }
