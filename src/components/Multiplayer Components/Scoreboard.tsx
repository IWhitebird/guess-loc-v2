import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers/reducers';

export default function Scoreboard({ userRoundDetails }: any) {
    const game = useSelector((state: RootState) => state.game)
    const [userScores, setUserScores] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        updateScores();
    }, [userRoundDetails]);

    const updateScores = () => {
        userRoundDetails.forEach((roundDetails: any) => {
            const { user_id, userPoints } = roundDetails;

            setUserScores((prevScores) => ({
                ...prevScores,
                [user_id]: (prevScores[user_id] || 0) + userPoints,
            }));
        });
    };



    return (
        <div className="absolute w-auto p-5 py-3 z-40 text-white rounded-3xl bg-[rgba(50,50,50,0.1)] backdrop-blur-lg border-gray-300 border flex flex-col gap-3 left-3 top-3">

            <div className="flex w-full justify-center text-lg items-center">
                <p>Round {game.cur_round}</p>
            </div>

            {userRoundDetails.map((roundDetails: any, index: number) => (
                <div className='flex gap-5' key={index}>
                    <img src={roundDetails.user_img ? roundDetails.user_img : `https://api.dicebear.com/6.x/personas/svg?seed=${roundDetails.user_name}`} className="w-12 rounded-full" />
                    <div className='flex flex-col'>
                        <p>{roundDetails.user_name}</p>
                        <p className="text-lg">Score: {userScores[roundDetails.user_id] || 0}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
