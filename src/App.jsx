import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ReportIssue from './pages/ReportIssue'
import MyReports from './pages/MyReports'
import IssueDetails from './pages/IssueDetails'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
export default function App(){return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/report" element={<ProtectedRoute><ReportIssue/></ProtectedRoute>}/><Route path="/reports" element={<ProtectedRoute><MyReports/></ProtectedRoute>}/><Route path="/reports/:id" element={<ProtectedRoute><IssueDetails/></ProtectedRoute>}/><Route path="*" element={<Home/>}/></Routes></Layout>}
