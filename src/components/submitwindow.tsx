import { useEffect, useRef, useState } from 'react';

interface SubmitWindowProps {
    lat1: number;
    lng1: number;
    guessLat: number;
    guessLng: number;
    score: number;
    distance: number;
    rounds: number;
    points: number;
}

const SubmitWindow = ({
    lat1,
    lng1,
    guessLat,
    guessLng,
    distance,
    points,
}: SubmitWindowProps) => {
    const submitMapContainerRef = useRef(null);

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

    // function onReset() {
    //     setScore(0);
    //     setRounds(5);
    //     generateRandomPoint();
    //     setTimeRemaining('120');
    // }

    return (
        <div className="w-[100%] h-full absolute top-0 flex justify-center  items-center z-50">
            <div className='h-[700px] w-full' ref={submitMapContainerRef}>asdasda</div>
            <div className='absolute flex justify-center flex-col items-center '>
                <div className='bg-[rgba(0,0,0,0.5)] flex items-center flex-col p-10'>
                    <div className=' text-white text-4xl p-5'>
                        <h3>Result</h3>
                    </div>
                    <div className=' text-white text-3xl'>
                        <div>
                            <div className='mb-2'>
                                Points earned : {points}
                            </div>
                            Distance : {Math.round(distance)} Km
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitWindow;