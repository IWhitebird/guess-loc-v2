import { FaChevronCircleDown } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'

interface IncomingAccordionProps {
    request: any;
    index: any;
}

function IncomingAccordion({ request, index }: IncomingAccordionProps) {
    const [menu, setMenu] = useState({ visible: false, id: '' })
    const [modal, setModal] = useState({ visible: false, id: '' })
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setMenu((prevMenu: any) => ({ ...prevMenu, visible: false }))
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownRef])

    return (
        <ul className='flex flex-col gap-1' id='style-3' key={index}>
            <li className='flex items-center justify-between w-full'>
                <div className='relative flex items-center gap-3'>
                    <img className='rounded-full' src={request?.user_pfp ? request?.user_pfp : `https://api.dicebear.com/6.x/personas/svg?seed=${request.user_name}`} alt='avatar' width='60' height='60' />
                    <div className='absolute bottom-0 w-5 h-5 bg-blue-800 border border-white rounded-full left-10'></div> {/* online change left to left-10 */}
                    <div className='flex flex-col'>
                        <p>{request.user_name}</p>
                        <p className='text-sm text-gray-400'>Sent you a friend request</p>
                    </div>
                </div>

                {/* dropdown */}
                <div className={`flex items-center gap-3 pr-8 relative`} ref={dropdownRef}>
                    <p
                        className={`cursor-pointer duration-300 text-2xl ${menu.visible && menu.id === request.id && 'rotate-180'}`}
                        onClick={() => setMenu((prevMenu: any) => ({ visible: !prevMenu.visible, id: request.id }))}>
                        <FaChevronCircleDown />
                    </p>
                    <div className={`absolute overflow-hidden ease-in-out duration-300 ${menu.id === request.id && menu.visible ? 'opacity-100 h-[110px] w-[120px] ' : 'opacity-0 invisible h-0 w-0'} flex z-50 justify-center items-center top-8 right-8 bg-[rgba(30,30,30,0.8)] shadow-2xl backdrop-blur-3xl p-5 rounded-2xl`}>
                        <ul className={`flex flex-col cursor-pointer duration-300 gap-3 ${menu.id === request.id && menu.visible ? 'opacity-100' : 'opacity-0 invisible'}`}>

                            <li className='duration-300 hover:text-green-700'>Accept</li>
                            <li className='duration-300 hover:text-red-700' onClick={() => setModal({ visible: true, id: request.id })}>Reject</li>
                        </ul>
                    </div>
                </div>

                {/* modal */}
                <div className={`fixed top-0 left-0 duration-300 ${modal.id === request.id ? 'opacity-100' : 'opacity-0 invisible'} px-10 z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.6)] '}`}>
                    <div className={`text-xl bg-[rgba(0,0,0,0.2)] backdrop-blur-lg duration-300 text-white border border-gray-700 p-5 rounded-xl ${modal.id === request.id ? 'scale-100 opacity-100' : 'scale-50 opacity-0 invisible'}`}>
                        <p className='text-xl'>Are you sure you want to reject <span className='border-b'>{request.user_name}'s</span> friend request?</p>
                        <div className='flex justify-end gap-3 mt-5'>
                            <button className='px-3 py-1 text-white duration-300 bg-purple-900 rounded-lg hover:bg-purple-950' onClick={() => (console.log('lool'))}>Yes</button>
                            <button className='px-3 py-1 text-white duration-300 bg-purple-900 rounded-lg hover:bg-purple-950' onClick={() => setModal({ visible: false, id: '' })}>No</button>
                        </div>
                    </div>
                </div>
            </li>
            <hr className='mr-5 border mt-2' />
        </ul>
    )
}

export default IncomingAccordion