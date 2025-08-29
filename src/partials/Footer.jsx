import React from 'react'

function Footer() {
  return (
    <footer className="tracking-wide dark:bg-gray-800 bg-white px-10 pt-10 pb-6 mt-2 ">
      <div className="flex flex-wrap max-md:flex-col gap-4">
        <p className="dark:text-slate-100 text-sm md:ml-auto">Copyright © {new Date().getFullYear()} - All right reserved by <span style={{
          fontFamily: 'Arial Black, Gadget,  ui-sans-serif',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
            Rutuja Fulbagkar
        </span>
        </p>

      </div>
    </footer>
  )
}

export default Footer