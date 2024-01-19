import React, { useEffect, useState } from 'react';



interface Props {
    handlevolume: () => void;
}

const Volume: React.FC<Props> = ({ handlevolume }) => {
    const [volume, setVolume] = useState<number>(50);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(event.target.value, 10);
        setVolume(newVolume);
    };

    const getvol = parseInt(localStorage.getItem('volume') || '50');

    useEffect(() => {
        localStorage.setItem('volume', volume.toString());
    }, [volume])

    useEffect(() => {
        if (getvol) {
            setVolume(getvol)
        }
    },[])

    return (
        <div className='absolute justify-center items-center top-0 z-50 left-0 flex bg-[rgba(0,0,0,0.5)] w-full h-screen backdrop-blur-md'>
            <label htmlFor="volumeSlider">Volume</label>
            <input
                type="range"
                id="volumeSlider"
                min={0}
                max={100}
                value={volume}
                onChange={handleChange}
            />

            <span>{volume}</span>
            <button onClick={handlevolume} className='absolute px-4 py-2 border-2 rounded-full bottom-20'>
                close
            </button>
        </div>
    );
};

export default Volume;
