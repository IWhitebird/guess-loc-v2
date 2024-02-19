
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers/reducers';


interface props {
    round_no: number;
    lat1: number;
    lng1: number;
    guessLat: number
    guessLng: number;
    userRoundDetails: any;
}

function Results({ round_no, lat1, lng1, guessLat, guessLng, userRoundDetails }: props) {
    const [midLat, setMidLat] = useState(0);
    const [midLng, setMidLng] = useState(0);
    const user = useSelector((state: RootState) => state.user)

    console.log(userRoundDetails)

    const submitMapContainerRef = useRef<HTMLDivElement | null>(null);
    const infoWindowRef1 = useRef(new window.google.maps.InfoWindow());
    const infoWindowRef2 = useRef(new window.google.maps.InfoWindow());

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

    const getMarkerColor = (index: number): string => {
        const colors = ['blue', 'green', 'yellow', 'purple'];
        return colors[index % colors.length];
    };

    useEffect(() => {
        midFunc(lat1, lng1, guessLat, guessLng);

        const initializeMap2 = () => {
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

            infoWindowRef1.current?.setContent('Actual Location');
            infoWindowRef1.current?.open(map, marker1);

            userRoundDetails.filter((detail: any) => detail.round_no === round_no).forEach((userDetails: any, index: number) => {
                const marker2 = new window.google.maps.Marker({
                    position: { lat: userDetails.guessLat, lng: userDetails.guessLng },
                    map: map,
                    icon: `https://maps.google.com/mapfiles/ms/icons/${user.user_id === userDetails.user_id ? 'red' : getMarkerColor(index)}.png`,
                });

                const infoWindow = new window.google.maps.InfoWindow();
                infoWindow.setContent(`Guessed by ${user.user_id === userDetails.user_id ? 'You' : userDetails.user_name}`);
                infoWindow.open(map, marker2);

                const lineCoordinates = [
                    { lat: lat1, lng: lng1 },
                    {
                        lat: userDetails.guessLat,
                        lng: userDetails.guessLng
                    },
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
            });
        };

        initializeMap2();
    }, [])
    return (
        <div className='flex w-full'>
            <div className='h-[500px] w-full opacity-95' ref={submitMapContainerRef}></div>
        </div>
    )
}

export default Results
