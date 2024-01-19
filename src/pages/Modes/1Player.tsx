import { useEffect, useRef, useState } from "react";
import randomStreetView from "../../scripts/index";
import SubmitWindow from "../../components/submitwindow";

declare global {
    interface Window {
        initMap: () => void;
        google: any;
    }
}

export default function OnePlayer() {
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [points, setPoints] = useState(0);
    const [miniWindow, setMiniWindow] = useState(false);
    const [distance, setDistance] = useState(0);
    const [rounds, setRounds] = useState(5);
    const mapContainerRef = useRef(null);
    const streetViewContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [pauseTimer, setPauseTimer] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('00:00');
    let marker: any = null;
    const [guessLat, setGuessLat] = useState(0);
    const [guessLng, setGuessLng] = useState(0);

    useEffect(() => {
        setPauseTimer(false);
        generateRandomPoint();
    }, []);

    useEffect(() => {
        const loadGoogleMapScript = () => {
            if (lat && lng) {
                try {
                    const script = document.createElement("script");
                    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}&callback=initMap`;
                    script.async = true;
                    script.defer = true;
                    window.initMap = initMap;
                    document.head.appendChild(script);
                }
                catch (error) {
                    console.error("Error while loading google maps script:", error);
                }
            }
        };

        const initMap = () => {
            const mapOptions = {
                center: { lat: 0, lng: 0 },
                zoom: 0.641,
                minZoom: 0.641,
                disableDefaultUI: true,
                mapTypeControl: false,
                keyboardShortcuts: false,
                streetViewControl: false,
                mapTypeId: window.google.maps.MapTypeId.ROADMAP,
                restriction: {
                    latLngBounds: {
                        north: 85,
                        south: -85,
                        west: -180,
                        east: 180,
                    },
                    strictBounds: false,
                },
                styles: [
                    {
                        featureType: "all",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }],
                    },
                    {
                        featureType: "landscape",
                        elementType: "labels",
                        stylers: [{ visibility: "on" }],
                    },
                    {
                        featureType: "administrative.country",
                        elementType: "labels",
                        stylers: [{ visibility: "on" }],
                    },
                    {
                        featureType: "administrative.locality",
                        elementType: "labels",
                        stylers: [{ visibility: "on" }],
                    },
                ],
            };

            const panoramaOptions = {
                position: { lat, lng },
                pov: { heading: 0, pitch: 0 },
                zoom: 1,
                disableDefaultUI: true,
                showRoadLabels: false,
                linksControl: true,
                panoProviderOptions: {
                    hideLogo: true,
                    disableCompass: true,
                    panoId: "gs_id:remove_labels",
                },
            };

            const map = new window.google.maps.Map(
                mapContainerRef.current,
                mapOptions
            );
            mapRef.current = map;

            const panorama = new window.google.maps.StreetViewPanorama(
                streetViewContainerRef.current,
                panoramaOptions
            );
            map.setStreetView(panorama);

            window.google.maps.event.addListener(map, "mousemove", function () {
                map.setOptions({ draggableCursor: "crosshair" });
            });
            map.addListener("click", (event: any) => {
                placeMarker(event.latLng);
            });
        };

        if (!window.google) {
            loadGoogleMapScript();
        } else {
            initMap();
        }
    }, [lat, lng]);

    useEffect(() => {
        let timerId: any;
        let timeInSeconds = 120;

        if (!pauseTimer) {
            timerId = setInterval(() => {
                if (timeInSeconds <= 0) {
                    clearInterval(timerId);
                    submitHandle();
                } else {
                    timeInSeconds--;
                    const minutes = Math.floor(timeInSeconds / 60);
                    const seconds = timeInSeconds % 60;
                    const formattedMinutes = minutes.toString().padStart(2, '0');
                    setTimeRemaining(`${formattedMinutes}:${seconds.toString().padStart(2, '0')}`);
                }
            }, 1000);
        }

        return () => {
            clearInterval(timerId);
        };
    }, [pauseTimer]);

    function placeMarker(location: any) {
        if (marker) {
            marker.setPosition(location);
        } else {
            marker = new window.google.maps.Marker({
                position: location,
                map: mapRef.current,
            });
        }

        setGuessLat(marker.position.lat());
        setGuessLng(marker.position.lng());
    }

    async function generateRandomPoint() {
        try {
            const locations = await randomStreetView.getRandomLocations(1);
            setLat(locations[0][0]);
            setLng(locations[0][1]);
            setMiniWindow(false);
            setPauseTimer(false);
            setTimeRemaining('00:00');
        } catch (error) {
            console.error("Error while generating random point:", error);
        }
    }

    function CalcDistance(lat1: number, lat2: number, lon1: number, lon2: number) {
        lon1 = (lon1 * Math.PI) / 180;
        lon2 = (lon2 * Math.PI) / 180;
        lat1 = (lat1 * Math.PI) / 180;
        lat2 = (lat2 * Math.PI) / 180;
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a =
            Math.pow(Math.sin(dlat / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
        let c = 2 * Math.asin(Math.sqrt(a));
        let r = 6371;
        return c * r;
    }

    function submitHandle() {
        setPauseTimer(true);
        try {
            const distance = CalcDistance(lat, guessLat, lng, guessLng);
            if (distance === 0) {
                setPoints(0);
            } else {
                let newPoints = Math.max(0, 5000 - distance);
                newPoints = Math.round(newPoints);
                setPoints(newPoints);
            }
            setRounds(rounds - 1);
            setMiniWindow(true);
            setDistance(distance);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="bg-black w-full h-screen">
            <div className="w-full h-screen" ref={streetViewContainerRef}></div>
            {miniWindow === true ? (<>
            </>) : (
                <>
                    <div className="absolute h-[300px] w-[400px] hover:scale-125 hover:right-20 hover:bottom-52 z-50 right-10 bottom-36  transition-all duration-200 ease-in-out opacity-50 cursor-crosshair" ref={mapContainerRef}></div>
                    {rounds <= 0 ? <></> : <button className="absolute bottom-20 right-20 text-2xl hover:bg-green-700 text-white bg-green-500 px-5 py-2 rounded-2xl z-50" onClick={submitHandle}>
                        Guess
                    </button>
                    }
                </>
            )}
            <div className=" text-white p-10 absolute top-0">
                {rounds === 0 ? (
                    <>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center items-start flex-col w-52">

                            <div className="z-30 w-full text-2xl">
                                <div className="absolute z-40 p-4">
                                    Rounds:
                                    <br />
                                    {rounds} / 5
                                </div>
                                <div className="z-30  rounded-br-[2rem] rounded-lg opacity-50 bg-green-700 p-12 px-14 w-20 ">
                                </div>
                            </div>
                            <div className="mt-4 text-2xl w-36">
                                Score : {points}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="absolute z-10 w-full top-10">
                <div className="flex justify-center items-center mt-5">
                    <div className="rounded-full gap-10 text-xl text-white bg-purple-700 border border-purple-950 px-5 py-2">
                        {timeRemaining}
                    </div>
                </div>
            </div>
            {miniWindow && (
                <SubmitWindow
                    lat1={lat}
                    lng1={lng}
                    distance={distance}
                    guessLat={guessLat}
                    guessLng={guessLng}
                    score={points}
                    rounds={rounds}
                    points={points}
                />
            )}
        </div>
    );
};