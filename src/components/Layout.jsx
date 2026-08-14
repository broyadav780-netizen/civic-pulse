import { NavLink } from 'react-router-dom'
import { Home, FilePlus2, ClipboardList, Menu, X } from 'lucide-react'
import { useState } from 'react'
const links = [{to:'/', label:'Home', icon:Home},{to:'/report',label:'Report issue',icon:FilePlus2},{to:'/reports',label:'My reports',icon:ClipboardList}]
export default function Layout({ children }) { const [open,setOpen]=useState(false); return <><header><NavLink to="/" className="brand">Civic<span>Pulse</span></NavLink><button className="menu-button" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav className={open?'open':''}>{links.map(({to,label,icon:Icon})=><NavLink end={to==='/' } to={to} key={to} onClick={()=>setOpen(false)}><Icon size={18}/>{label}</NavLink>)}</nav></header><main>{children}</main></> }
