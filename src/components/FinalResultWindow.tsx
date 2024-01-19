import { useEffect, useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import supabase from '../supabase/init'

interface FinalResultProps {
    score: number;
    onReset: any;
    rounds: number;
}

const FinalResult = ({ score, onReset, rounds }: FinalResultProps) => {
    const loggedIN = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '{}');
    const [loading, setLoading] = useState(true)
    const [newScore, setNewScore] = useState(false)

    const getScore = async () => {
        const { data, error } = await supabase.from('users').select('user_maxscore').eq('id', loggedIN.user.id)
        if (error) {
            console.log(error)
            return
        }
        if (data) {
            if (score > data[0].user_maxscore) {
                setNewScore(true)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        getScore()
    }, [])

    const style = `bg-[rgba(0,0,0,0.5)] backdrop-blur-lg shadow-xl p-10 w-[1000px] h-[250px] text-2xl text-white flex justify-center items-center flex-col rounded-xl shadow-xl `

    return (
        <>
            {
                loading && <div className="flex justify-center items-center h-full">
                    <ImSpinner2 className="animate-spin text-white text-6xl" />
                </div>
            }
            <div className='w-full absolute z-50 h-full flex justify-center items-center'>
                <div className='relative'>
                    {newScore ? (
                        <div className={style}>New personal best <span className='text-cyan-400'>{score} !!!</span></div>
                    ) : (
                        score === 0 ? (
                            <div>
                                <div className={style}>
                                    <p className='flex gap-2'>Final score{" "}
                                        <span className='text-cyan-400'>{score}
                                        </span>
                                    </p>
                                    <span>Try harder next time!</span>
                                </div>

                            </div>
                        ) : (
                            <div className={style}>Your Score is <span className='text-cyan-400'>{score}</span></div>
                        )
                    )}
                    <div className='absolute bottom-8 flex justify-center w-full z-50'>
                        <button className='text-white text-xl bg-lime-500 px-7 py-2 rounded-full transition-all ease-in-out duration-300 hover:border-r-8 hover:border-r-cyan-600 hover:scale-105' onClick={onReset}>Go again?</button>
                    </div>
                </div>
            </div>
        </>
    )
}


export default FinalResult