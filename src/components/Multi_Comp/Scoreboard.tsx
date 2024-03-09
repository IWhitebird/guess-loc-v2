import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers/reducers';
import { IUserRoundDetails } from '../../pages/Modes/MultiPlayer';

export default function Scoreboard({ userRoundDetails }: { userRoundDetails: IUserRoundDetails[] }) {
    const game = useSelector((state: RootState) => state.game)

    // const [userScores, setUserScores] = useState<{ [key: string]: number }>({});

    // useEffect(() => {
    //     updateScores();
    // }, [userRoundDetails]);

    // const updateScores = () => {
    //     userRoundDetails.forEach((roundDetails: any) => {
    //         const { user_id, userPoints } = roundDetails;

    //         setUserScores((prevScores) => ({
    //             ...prevScores,
    //             [user_id]: (prevScores[user_id] || 0) + userPoints,
    //         }));
    //     });
    // }

    return (
        <div className="absolute w-auto p-5 z-40 py-3 text-black rounded-3xl bg-[rgba(50,50,50,0.1)] backdrop-blur-lg border-gray-300 border flex flex-col gap-3 left-3 top-3">

            <div className="flex w-full justify-center text-lg items-center">
                <p>Round {game.cur_round}</p>
            </div>

            {game && game.game_participants.map((Particiapant, index: number) => (
                <div className='flex gap-5' key={index}>
                    <img src={Particiapant.room_user_image ? 
                        Particiapant.room_user_image : `https://api.dicebear.com/6.x/personas/svg?seed=${Particiapant.room_user_name}`} 
                        className="w-12 rounded-full" />
                  
                    <div className='flex flex-col'>
                        <p>{Particiapant.room_user_name}</p>
                        {/* <p className="text-lg">Score: {userScores[Particiapant.room_user_id] || 0}</p> */}
                        <p>{userRoundDetails.filter(e => e.user_id === Particiapant.room_user_id  &&  
                            e.round_no === game.cur_round).length ? 'Gussed' : 'Not Gussed'}</p>
                    </div>

                </div>
            ))}

            
        </div>
    )
}

