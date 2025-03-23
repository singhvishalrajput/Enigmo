import React, { useEffect, useState } from 'react'
import logo from "../assets/logo.png"
import menu_icon from "../assets/menu_open.svg"
import menu_close from "../assets/menu_close.svg"
import { useLocation } from 'react-router-dom'


const Navbar = () => {

    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const location = useLocation()

    useEffect(()=> {
        if(showMobileMenu){
            document.body.style.overflow = 'hidden'
        }else{
            document.body.style.overflow = 'auto'
        }
        return ()=>{
            document.body.style.overflow = 'auto'
        }
    }, [showMobileMenu])

  return (
    <div className='absolute top-0 left-0 w-full z-10'>
        <div className='container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32'>
            <img src={logo} alt="" className='h-12' />
            <ul className='hidden md:flex gap-7'>
                <a href="#Home" className={`${location.pathname=== "/" ? "text-green-900":"text-black"} cursor-pointer hover:text-gray-400`}>Home</a>
                <a href="#Compute" className={`${location.pathname=== "/Compute" ? "text-green-900":"text-black"} cursor-pointer hover:text-gray-400`}>Compute</a>
                <a href="#About" className={`${location.pathname=== "/About" ? "text-green-900":"text-black"} cursor-pointer hover:text-gray-400`}>About</a>
            </ul>
            <a href="#Contact">
            <button className='hidden md:block bg-green-900 text-white px-8 py-2 rounded-full hover:bg-white hover:text-green-900 hover:border cursor-pointer'>Contact us</button>
            </a>
            <img
             onClick={()=> setShowMobileMenu(true)}
            src={menu_icon} alt="" className=' rounded py-2 px-2 bg-green-900 md:hidden w-12 cursor-pointer' />
        </div>
        {/* ------------- mobile menu ------- */}
        <div className={`md:hidden ${showMobileMenu ? 'fixed w-full' :'h-0 w-0' }  right-0 top-0 bottom-0 overflow-hidden bg-white`}>
            <div
            className='flex justify-end p-6 cursor-pointer'>
                <img
                onClick={()=> setShowMobileMenu(false)}
                src={menu_close}
                className=' rounded py-2 px-2 bg-green-900 md:hidden w-11' alt="" />
            </div>
            
            <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                <a onClick={()=> setShowMobileMenu(false)} href="#Home" className='px-4 py-2 rounded-full inline-block hover:text-green-900'>Home</a>
                <a onClick={()=> setShowMobileMenu(false)} href="#Compute" className='px-4 py-2 rounded-full inline-block hover:text-green-900'>Compute</a>
                <a onClick={()=> setShowMobileMenu(false)} href="#About" className='px-4 py-2 rounded-full inline-block hover:text-green-900'>About</a>
            </ul>
            </div>
        </div>
    
  )
}

export default Navbar