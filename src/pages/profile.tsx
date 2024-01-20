import { useEffect, useState } from 'react'
import supabase from '../supabase/init'

const Profile = () => {
    const prof = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '')
    console.log(prof.user);
    const [maxScore, setmaxScore] = useState(0)

    const getScore = async () => {
        const { data, error } = await supabase.from('users').select('user_maxscore').eq('id', prof.user.id)
        if (error) {
            console.log(error)
            return
        }
        if (data) {
            setmaxScore(data[0].user_maxscore)
        }
    }

    useEffect(() => {
        getScore()
    }, [])
    return (
        <div className="bg-purple-950 w-full h-[100vh] ">
            <div className="flex flex-col text-white justify-center items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
                    <h1 className='py-10 pt-20 text-4xl'>Profile</h1>
                    <div className='relative border border-purple-600 rounded-lg'>
                        <div className='p-4'>
                            <img src={prof.user.user_metadata.picture} alt="Description of the image" className='pt-4 h-36 w-36' />
                            <h1 className='relative text-2xl left-44 bottom-28'>Level 35</h1>
                            <div className="left-16 progress_bar bottom-24"></div>
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