import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Button } from "@/components/ui/button"
import { AdminTable } from "@/components/admin/Table"
import { Navbar } from "@/components/admin/Navbar"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-screen min-h-screen bg-slate-950">
      <Navbar />
      <div className="w-full lg:w-1/2 mx-auto bg-white/10 p-5 text-white mt-2">
        <AdminTable />
      </div>
    </div>
  )
}

export default App
