import { useState } from "react";
import { FaChevronCircleRight } from "react-icons/fa";

useState
interface props {
    visible: boolean
    setVisible: (visible: boolean) => void
    searchTerm: string
    handleSearch: (e: any) => void
}

function FrListSearchModal({ visible, setVisible, searchTerm, handleSearch }: props) {

    return (
        <div className={`flex items-center px-5 justify-between absolute top-0 right-0 h-[4.4rem] w-full bg-[rgba(50,50,50,1)] duration-300 z-50 ${visible ? 'opacity-100' : 'opacity-90 right-[-500px]'}`}>
            <input type="text" placeholder='Search using user-name'
                className='bg-[rgba(30,30,30,1)] duration-300 w-[305px] text-white border border-purple-800 p-2 pl-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent'
                value={searchTerm}
                onChange={handleSearch}
            />
            <button className='w-[20px] h-[20px]' id='fn_button' onClick={() => setVisible(false)}
                style={{ fontSize: '1.5rem', padding: '1.2rem 2rem' }}
            ><p><FaChevronCircleRight /></p><span id='fnButtonSpan'></span></button>
        </div>
    )
}

export default FrListSearchModal