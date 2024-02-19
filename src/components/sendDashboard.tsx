import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../redux/reducers/reducers"
import supabase from "../supabase/init"
import toast from "react-hot-toast"
import { removeRoom, setRoom } from "../redux/slices/roomSlice"
import Dashboard from "./profileBar"
import Notification from "./notification"
import AudioPlayer from "./AudioPlayer"
import FriendsList from "./Friends/FriendsList"
import { useLocation, useNavigate } from "react-router-dom"

interface Props {
    loggedIN: any
    friendModal: boolean
    audioSettings: boolean
    setFriendModal: any
    setAudioSettings: any
}


const SendDashboard = ({ loggedIN, friendModal, audioSettings, setFriendModal, setAudioSettings }: Props) => {
    const navigate = useNavigate()
    const location = useLocation()

    const { user_id, user_name, user_profile_pic } = useSelector((state: RootState) => state.user)
    const roomDetails = useSelector((state: RootState) => state.room)

    const [handleState, setHandleState] = useState('list')
    const [notifModal, setNotifModal] = useState(false)
    const [receivedNotif, setReceivedNotif] = useState(false)
    const { room_id } = useSelector((state: RootState) => state.room)
    const [existingRoom, setExistingRoom] = useState(room_id ? true : false)

    const dispatch = useDispatch()

    async function AlreadyInRoomHandle() {
        const findRoom = await supabase
            .from('custom_room')
            .select()
            .eq('room_id', room_id)

        if (findRoom.error) {
            toast.error("Room doesnt exist")
            localStorage.removeItem('custom_room_details')
            dispatch(removeRoom())
            setExistingRoom(false)
            return;
        }

        dispatch(setRoom(findRoom.data[0] as any))
        navigate(`/customroom/Room/${room_id}`)
    }

    useEffect(() => {
        if (room_id) {
            setExistingRoom(true)
        }
        else {
            setExistingRoom(false)
        }
    }, [room_id])

    useEffect(() => {
        const onlineChannel = supabase.channel(`${roomDetails.room_id}_active`);
        let onlineStatus: string;

        onlineChannel.on('presence', { event: 'sync' }, () => {
            const newState = onlineChannel.presenceState();
            for (const key in newState) {
                const user = newState[key];
                for (const key in user) {
                    //@ts-ignore
                    onlineStatus = user[key].user_id;
                }
            }
        }).subscribe(async (status) => {
            if (status !== 'SUBSCRIBED') return;
            await onlineChannel.track({ user_id, user_name, user_profile_pic });
        });

        return () => {
            onlineChannel.unsubscribe();
        }
        
    }, [user_id]);

    // console.log(existingRoom)
    return (
        <>
            <div className='absolute w-full'>
                {
                    existingRoom && !location.pathname.includes('spGame') && !location.pathname.includes('mpGame')
                    &&
                    <div className="aboslute w-full">
                        <button
                            id='fn_button'
                            className={`absolute right z-50`}
                            onClick={AlreadyInRoomHandle}>
                            Return to Room
                        </button>
                    </div>
                }
                <Dashboard setFriendModal={setFriendModal} visible={friendModal} audioSettings={audioSettings} setAudioSettings={setAudioSettings} setNotifModal={setNotifModal}
                    receivedNotif={receivedNotif} setReceivedNotif={setReceivedNotif} />
                <Notification handleState={handleState} setHandleState={setHandleState} friendModal={friendModal}
                    setFriendModal={setFriendModal} visible={notifModal} setVisible={setNotifModal} receivedNotif={receivedNotif} setReceivedNotif={setReceivedNotif} />
                <AudioPlayer audioSettings={audioSettings} setAudioSettings={setAudioSettings} />
            </div>
            {
                loggedIN.user_id !== '' &&
                <FriendsList visible={friendModal} setVisible={setFriendModal} handleState={handleState} setHandleState={setHandleState} />
            }
        </>
    )
}

export default SendDashboard
