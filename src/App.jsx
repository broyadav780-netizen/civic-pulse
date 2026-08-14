import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ReportIssue from './pages/ReportIssue'
import MyReports from './pages/MyReports'
import IssueDetails from './pages/IssueDetails'
export default function App(){return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/report" element={<ReportIssue/>}/><Route path="/reports" element={<MyReports/>}/><Route path="/reports/:id" element={<IssueDetails/>}/><Route path="*" element={<MyReports/>}/></Routes></Layout>}
