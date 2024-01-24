import { useEffect, useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { findUser } from '../supabase/Routes/MainRoutes'

interface FinalResultProps {
    score: number;
    onReset: any;
    rounds: number;
}

const FinalResult = ({ score, onReset }: FinalResultProps) => {
    const loggedIN = JSON.parse(localStorage.getItem('sb-pdnogztwriouxeskllgm-auth-token') || '{}');
    const [loading, setLoading] = useState(true)
    const [newScore, setNewScore] = useState(false)
    const [maxScore, setmaxScore] = useState(0)

    const getScore = async () => {
        const data = await findUser(loggedIN.user.id)
        if (data) {
            if (score > (data?.user_maxscore ?? 0)) {
                setmaxScore(data?.user_maxscore ?? 0)
                setNewScore(true)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        getScore()
    }, [])

    const style = `bg-[rgba(0,0,0,0.3)] backdrop-blur-lg shadow-xl p-10 w-screen h-screen text-4xl text-white flex justify-center gap-5 items-center flex-col rounded-xl shadow-xl `

    return (
        <>
            {
                loading && <div className="flex bg-[rgba(0,0,0,0.5)] backdrop-blur-md absolute w-full top-0 bottom-0 z-50 justify-center items-center h-full">
                    <ImSpinner2 className="animate-spin text-white text-6xl" />
                </div>
            }
            <div className='w-full absolute z-40 h-full flex justify-center items-center'>
                <div className='relative'>
                    {newScore ? (
                        <div className={style}>
                        <p className='flex gap-2'>New personal best!{" "}</p>
                        Points : {score}
                    </div>
                    ) : (
                        score === 0 ? (
                            <div>
                                <div className={style}>
                                    <p className='flex'>Final Points{score}</p>
                                    <span>Try harder next time!</span>
                                </div>

                            </div>
                        ) : (
                            <div className={style}>
                                <p className='flex gap-2'>Final Points of this game{" "}</p>
                                Points : {score}, which is {score <= maxScore ? 'higher than' : 'lower than'} your personal best.
                            </div>
                        )
                    )}
                    <div className='absolute bottom-20 flex justify-center w-full z-40'>
                        <button id='fn_button' onClick={onReset}>Head to menu<span id='fnButtonSpan'></span></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FinalResult