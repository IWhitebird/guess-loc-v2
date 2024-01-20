import { useEffect, useRef, useState } from 'react';
import FinalResult from './FinalResultWindow';
import supabase from '../supabase/init'
import { useNavigate,useLocation } from 'react-router-dom';

interface SubmitWindowProps {
    lat1: number;
    lng1: number;
    guessLat: number;
    guessLng: number;
    distance: number;
    rounds: number;
    points: number;
    generateRandomPoint: any;
    setRounds: any
    setPoints: any
}

const SubmitWindow = ({
    lat1,
    lng1,
    guessLat,
    guessLng,
    distance,
    points,
    rounds,
    setRounds,
    setPoints,
    generateRandomPoint,
}: SubmitWindowProps) => {
    const location2 = useLocation()
    const navigate = useNavigate();
    const loggedIN = JSON.parse(localStorage.getItem('sb-stglscmcmjtwkvviwzcc-auth-token') || '{}');
    const submitMapContainerRef = useRef(null);
    const infoWindowRef1 = useRef(new window.google.maps.InfoWindow());
    const infoWindowRef2 = useRef(new window.google.maps.InfoWindow());
    const [modal, setModal] = useState(false);

    const [midLat, setMidLat] = useState(0);
    const [midLng, setMidLng] = useState(0);

    const midFunc = (lat1: number, lng1: number, guessLat: number, guessLng: number) => {
        const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

        const lat1Rad = toRadians(lat1);
        const lng1Rad = toRadians(lng1);
        const lat2Rad = toRadians(guessLat);
        const lng2Rad = toRadians(guessLng);

        const midLat = (lat1Rad + lat2Rad) / 2;
        const midLng = (lng1Rad + lng2Rad) / 2;

        const midLatDegrees = (midLat * 180) / Math.PI;
        const midLngDegrees = (midLng * 180) / Math.PI;

        setMidLat(midLatDegrees);
        setMidLng(midLngDegrees);

        return;
    };

    useEffect(() => {
        midFunc(lat1, lng1, guessLat, guessLng);
        const initializeMap = () => {
            const mapOptions = {
                center: { lat: midLat, lng: midLng },
                zoom: 3,
                disableDefaultUI: true,
            };

            let map = new window.google.maps.Map(submitMapContainerRef.current, mapOptions);

            let marker1 = new window.google.maps.Marker({
                position: { lat: lat1, lng: lng1 },
                map: map,
                title: 'Actual Location',
            });

            let marker2 = new window.google.maps.Marker({
                position: { lat: guessLat, lng: guessLng },
                map: map,
                title: 'Guessed Location',
                icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            });

            infoWindowRef1.current.setContent('Actual Location');
            infoWindowRef2.current.setContent('Guessed Location');

            infoWindowRef1.current.open(map, marker1);
            infoWindowRef2.current.open(map, marker2);

            const lineCoordinates = [
                { lat: lat1, lng: lng1 },
                { lat: guessLat, lng: guessLng },
            ];

            let polyline = new window.google.maps.Polyline({
                path: lineCoordinates,
                geodesic: false,
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 0,
                icons: [
                    {
                        icon: {
                            path: 'M 0,-1 0,1',
                            strokeOpacity: 1.0,
                            scale: 4,
                        },
                        offset: '0',
                        repeat: '20px',
                    },
                ],
            });

            polyline.setMap(map);
        };

        initializeMap();

        return () => {
            // Any cleanup code for the map or markers (if required)
        };
    }, [lat1, lng1, guessLat, guessLng, midLat, midLng]);

    const storeScore = async () => {
        const { data, error } = await supabase.from('users').select('user_maxscore').eq('id', loggedIN.user.id)
        if (error) {
            console.log(error)
            return
        }
        if (data) {
            if (points > data[0].user_maxscore) {
                const { data, error } = await supabase.from('users').update({ user_maxscore: points }).eq('id', loggedIN.user.id)
                if (error) {
                    console.log(error)
                    return
                }
            }
        }
    }

    function onReset() {
        storeScore()
        setPoints(0);
        setRounds(5);
        navigate('/mode')
    }

    return (
        <div className="w-full h-full overflow-hidden absolute top-0 flex justify-center items-center z-40">
            <div className={`absolute duration-300 ${location2.pathname === '/spGame' && modal ? 'opacity-100' : 'opacity-0 invisible'} z-50 justify-center items-center flex w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-md '}`}>
                <div className={`bg-[rgba(30,30,30,0.5)] text-2xl duration-300 text-white border border-gray-700 p-5 rounded-xl ${modal ? 'scale-100 opacity-100' : 'scale-50 opacity-0 invisible'}`}>
                    Are you sure you want to return to main menu?<br />
                    Your progress will be lost.
                    <div className='flex justify-end gap-3'>
                        <button className='bg-purple-900 hover:bg-purple-950 duration-300 text-white px-3 py-1 rounded-lg' onClick={() => window.location.href = "/mode"}>Yes</button>
                        <button className='bg-purple-900 hover:bg-purple-950 duration-300 text-white px-3 py-1 rounded-lg' onClick={() => setModal(!modal)}>No</button>
                    </div>
                </div>
            </div>
            <div className='h-[600px] z-40 w-full opacity-100' ref={submitMapContainerRef}>asdasda</div>
            <div className='absolute top-0 flex justify-start w-full left-10 items-center h-full '>
                <div className='bg-[rgba(0,0,0,0.5)] backdrop-blur-2xl shadow-2xl rounded-xl flex items-center flex-col p-5'>
                    <div className=' text-white text-3xl'>
                        <div>
                            <div className='mb-2'>
                                Points earned: {points}
                            </div>
                            Distance: {Math.round(distance)}km
                            <div className='mt-2'>
                                Rounds left: {rounds}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                rounds === 0 ? (<FinalResult score={points} onReset={onReset} rounds={rounds} />) :
                    (<div className='z-50'>
                        <div className='flex flex-row-reverse absolute text-white text-xl bottom-20 right-20 gap-3 '>
                            <button className='shadow-lg transition-all ease-in-out duration-300 rounded-full bg-purple-800 px-10 py-3 hover:bg-purple-900 hover:scale-105'
                                onClick={generateRandomPoint}
                            >
                                Next Round
                            </button>
                            {/* <button id="btn_reset" onClick={onReset}>Reset</button> */}
                            <button className='shadow-lg transition-all ease-in-out duration-300 rounded-full bg-purple-900 px-10 py-3 hover:bg-purple-950 hover:scale-105'
                                onClick={() => setModal(true)}>Back to menu</button>
                        </div>
                    </div>)

            }
        </div>
    );
};

export default SubmitWindow;