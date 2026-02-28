import React from 'react'
import { BrainCircuit, Sun } from 'lucide-react';


const  Navbar = () => {
  return (
    <div className="nav flex items-center justify-between h-[90px] bg-zinc-900px" style ={{padding:"0px 150px"}}>
      <div className='logo flex items-center gap-[10px]'>
          <BrainCircuit size={40} color="purple"/>
          <span className='text-5xl font-bold text-white ml-2'>Codify</span>
    </div>
    <div className='icons flex items-center gap-[20px]'>
      <i className='cursor-pointer transition-all hover:text-[#9333ea]'><Sun/></i>
    </div>
    </div>
    
  )
}

export default  Navbar