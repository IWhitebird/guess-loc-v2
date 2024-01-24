import { useEffect, useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { useParams } from 'react-router-dom';
import { getFriendProfile } from '../supabase/Routes/FriendRoutes';


const FriendProfilepage = () => {
    const [loading, setLoading] = useState(true)
    const [friendinfo,setFriendinfo] = useState<any>({});
    const { id } = useParams<{ id: string }>();
    
    const getFriendinfo = async () => {
        const data = await getFriendProfile(id)
        if (data) {
            setFriendinfo(data);
            setLoading(false);
            console.log("Friendinfo",data);
        }
    }

    useEffect(() => {
        getFriendinfo();
    }, [])
    return (
        <div className="bg-purple-950 w-full h-[100vh]">
            <div className="flex flex-col text-white items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
                {
                    loading && <div className="flex absolute justify-center z-50 items-center bg-[rgba(0,0,0,0.3)] backdrop-blur-xl w-full h-screen">
                        <ImSpinner2 className="text-6xl text-purple-900 animate-spin" />
                    </div>
                }

                {!loading &&
                    <div className="flex flex-col text-white items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
                        <h1 className='py-10 pt-20 text-4xl'>Profile</h1>
                        <div className='relative border border-purple-600 rounded-lg'>
                            <div className='flex flex-col gap-3 p-4'>
                                <div className='flex'>
                                    <img src={friendinfo.user_pfp} alt="Description of the image" className='pt-4 h-36 w-36' />
                                    <div className='flex flex-col items-center justify-center'>
                                        <h1 className='text-2xl '>Level 35</h1>
                                        <div className="progress_bar"></div>
                                        <p>XP</p>
                                    </div>
                                </div>
                                <h1 className='text-xl'>Name: {friendinfo.user_name}</h1>
                                <h1 className='text-xl'>Email: {friendinfo.user_email}</h1>
                                <h1 className='text-xl'>HighScore: {friendinfo.user_maxscore}</h1>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>

    )
}
export default FriendProfilepage;