import { useEffect, useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { findUser } from '../supabase/Routes/MainRoutes'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'

const Profile = () => {
    const prof = useSelector((state: RootState) => state.user)
    const [loading, setLoading] = useState(true)
    const [maxScore, setmaxScore] = useState(0)

    const getScore = async () => {
        setLoading(true)
        const data = await findUser(prof.user_id)
        if (data) {
            setLoading(false)
            setmaxScore(data.user_maxscore || 0);
        }
    }

    useEffect(() => {
        getScore()
    }, [])


    return (
        <div className="bg-purple-950 w-full h-[100vh]">
            <div className="flex flex-col text-white items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
                {
                    loading && <div className="flex absolute justify-center z-50 items-center bg-[rgba(0,0,0,0.3)] backdrop-blur-xl w-full h-screen">
                        <ImSpinner2 className="animate-spin text-purple-900 text-6xl" />
                    </div>
                }

                {!loading &&
                    <div className="flex flex-col text-white items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
                        <h1 className='py-10 pt-20 text-4xl'>Profile</h1>
                        <div className='relative border border-purple-600 rounded-lg'>
                            <div className='p-4 flex flex-col gap-3'>
                                <div className='flex'>
                                    <img src={prof.user_profile_pic} alt="Description of the image" className='pt-4 h-36 w-36' />
                                    <div className='flex flex-col justify-center items-center'>
                                        <h1 className=' text-2xl '>Level 35</h1>
                                        <div className="progress_bar"></div>
                                        <p>XP</p>
                                    </div>
                                </div>
                                <h1 className='text-xl'>Name: {prof.user_name}</h1>
                                <h1 className='text-xl'>Email: {prof.user_email}</h1>
                                <h1 className='text-xl'>HighScore: {maxScore}</h1>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
export default Profile;