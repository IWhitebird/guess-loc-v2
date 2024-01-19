import { useState, useEffect } from 'react';
import logo from '../assets/Untitled-1.png';
import Dashboard from '../components/profileBar.tsx';
import data from '../assets/data.ts';
import AudioPlayer from '../components/AudioPlayer'
import { Link, useNavigate } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';



function ModeSelect() {
    const location = useNavigate()
    const loggedIN = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '{}');

    const [text, setText] = useState('');
    const [img, setImg] = useState('');
    const [fadeIn, setFadeIn] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const handlevolume=()=>{
        setVisible(!visible);
    }

    useEffect(() => {
        if (loggedIN.access_token === null || loggedIN.access_token === undefined) {
            location('/auth')
            setLoading(false)
        }

        setImg(data[currentIndex].image);
        setText(data[currentIndex].text);
        setLoading(false)
        const timer = setTimeout(() => {
            setFadeIn(false);
            setTimeout(() => {
                setFadeIn(true);
                setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
            }, 500);
        }, 5000);

        return () => clearTimeout(timer);
    }, [currentIndex]);

    return (
        <div className="bg-purple-950 w-full h-[100vh]">

            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <ImSpinner2 className="text-6xl text-white animate-spin" />
                </div>
            ) : (
                <>
                    <div className="absolute flex justify-between w-full px-20 ">
                        <img className="invert w-[200px] h-[200px]" src={logo} alt="Logo" />
                        <Dashboard />
                    </div>

                    <div className="flex justify-start items-center px-24 h-[100vh] w-[100%] bg-gradient-to-r from-gray-950 to-transparent">
                        <div className="flex items-center justify-between">
                            <ul className="tracking-wider text-white uppercase ">
                                <Link to="/spGame">
                                    <li className="mb-8 text-5xl italic transition-all ease-in-out cursor-pointer duration-250 hover:tracking-wider hover:text-purple-300">
                                        Singleplayer
                                    </li>
                                </Link>
                                <Link to="/customroom">
                                    <li className="mb-8 text-5xl italic transition-all ease-in-out cursor-pointer duration-250 hover:tracking-wider hover:text-purple-300">
                                        Multiplayer
                                    </li>
                                </Link>
                                <li className="text-5xl italic transition-all ease-in-out cursor-pointer duration-250 hover:tracking-wider hover:text-purple-300" onClick={handlevolume}>
                                    Settings
                                </li>
                                <AudioPlayer visible={visible} setVisible={setVisible}/>
                            </ul>
                            <div className="w-[50%]">
                                <div key={data[currentIndex].id} className="flex flex-col items-center justify-center p-2">
                                    <img
                                        src={img}
                                        alt="Image"
                                        className={`w-[600px] h-[500px] rounded-xl mr-4 ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                                    />
                                    <ul className={`p-2 ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                                        <li className='mt-5 text-xl text-white'>{text}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ModeSelect;