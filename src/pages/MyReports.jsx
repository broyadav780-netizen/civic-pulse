import { useEffect, useState } from 'react'
import IssueCard from '../components/IssueCard'
import { LoadingState, ErrorState } from '../components/States'
import { issuesApi } from '../services/issuesApi'
export default function MyReports(){const [issues,setIssues]=useState(null);const [error,setError]=useState('');useEffect(()=>{issuesApi.list().then(setIssues).catch(e=>setError(e.message))},[]);if(error)return <ErrorState message={error}/>;if(!issues)return <LoadingState/>;return <section className="reports-page"><div className="row heading"><div><p className="kicker">CITIZEN DASHBOARD</p><h1>My reports</h1></div><span className="count">{issues.length} reports</span></div><div className="issues-grid">{issues.map(issue=><IssueCard key={issue.id} issue={issue}/>)}</div></section>}
