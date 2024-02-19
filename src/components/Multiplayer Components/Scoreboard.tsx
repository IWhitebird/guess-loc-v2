import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers/reducers';

export default function Scoreboard({ readyUsers }: any) {
    const game = useSelector((state: RootState) => state.game)

    return (
        <div className="absolute w-auto p-5 py-3 z-40 text-white rounded-3xl bg-[rgba(50,50,50,0.1)] backdrop-blur-lg border-gray-300 border flex flex-col gap-3 left-3 top-3">

            <div className="flex w-full justify-center text-lg items-center">
                <p>Round {game.cur_round}</p>
            </div>
            {Array.from(readyUsers).map((user: any, index: number) => (
                <div className='flex gap-5' key={index}>
                    <img src={user.userImg || `https://api.dicebear.com/6.x/personas/svg?seed=${user.userName}`} className="w-12 rounded-full" />
                    <div className='flex flex-col'>
                        <p>{user.userName}</p>
                        <p className="text-lg">Score:  1</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
