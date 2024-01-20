import { useEffect, useState } from 'react'
import supabase from '../supabase/init'
import { ImSpinner2 } from 'react-icons/im'

const Profile = () => {
    const prof = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '')
    const [loading, setLoading] = useState(true)
    const [maxScore, setmaxScore] = useState(0)

    const getScore = async () => {
        setLoading(true)
        const { data, error } = await supabase.from('users').select().eq('id', prof.user.id)
        if (error) {
            setLoading(false)
            console.log(error)
            return error
        }
        if (data) {
            setLoading(false)
            setmaxScore(data[0].user_maxscore)
        }
    }

    useEffect(() => {
        getScore()
    }, [])
    return (
        <div className="bg-purple-950 w-full h-[100vh]">
            {
                loading && <div className="flex justify-center z-50 items-center bg-[rgba(0,0,0,0.5)] backdrop-blur-md h-screen">
                    <ImSpinner2 className="animate-spin text-purple-900 text-6xl" />
                </div>
            }
            <div className="flex flex-col text-white items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
                <h1 className='py-10 pt-20 text-4xl'>Profile</h1>
                <div className='relative border border-purple-600 rounded-lg'>
                    <div className='p-4 flex flex-col gap-3'>
                        <div className='flex'>
                            <img src={prof.user.user_metadata.picture} alt="Description of the image" className='pt-4 h-36 w-36' />
                            <div className='flex flex-col justify-center items-center'>
                                <h1 className=' text-2xl '>Level 35</h1>
                                <div className="progress_bar"></div>
                                <p>XP</p>
                            </div>
                        </div>
                        <h1 className='text-xl'>Name: {prof.user.user_metadata.name}</h1>
                        <h1 className='text-xl'>Email: {prof.user.email}</h1>
                        <h1 className='text-xl'>HighScore: {maxScore}</h1>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Profile;