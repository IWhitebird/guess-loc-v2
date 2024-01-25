import { useEffect, useState } from "react"
import { CheckUser } from "../supabase/Auth"
import { ImSpinner2 } from "react-icons/im";

function Verify() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkLogin = async () => {
            setLoading(false)
            const user = await CheckUser()
            if (user?.aud === "authenticated") {
                setTimeout(() => {
                    window.location.href = '/mode'
                }, 1000)
            }
        }

        checkLogin()
    }, [])

    const redirect = () => {
        window.location.href = '/mode'
    }

    return (
        <div className="flex bg-gray-900 items-center justify-center h-screen">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <ImSpinner2 className="animate-spin text-white text-6xl" />
                </div>
            ) : (
                <div>
                    <div className="flex flex-col items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-green-600 w-28 h-28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h1 className="text-4xl text-white font-bold">Thank You !</h1>
                        <p className="text-lg text-white mt-5">You'll be redirected to the home page,<br />
                            <span className="text-blue-400 cursor-pointer pl-5" onClick={redirect} > click here if you're not redirected</span></p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Verify