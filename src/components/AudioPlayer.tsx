import React, { useEffect, useState } from 'react';
import ReactHowler from 'react-howler';
import Music from '../assets/music.mp3';

interface props{
    visible: boolean;
    setVisible:any;
}

const AudioPlayer = ({visible,setVisible}:props) => {
  const [volume, setVolume] = useState<number>(1);
  const [forceRender, setForceRender] = useState(false); // Add dummy state for force re-render
  const storedVolume = localStorage.getItem('volume');


  useEffect(() => {
    if (storedVolume !== null) {
      setVolume(parseFloat(storedVolume));
    }
  }, [storedVolume]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'volume') {
        setVolume(parseFloat(event.newValue || '1'));
        setForceRender((prev) => !prev); // Force re-render
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [forceRender]); // Add forceRender to the dependency array

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    localStorage.setItem('volume', newVolume.toString());
  };

  console.log('Current Volume:', volume);

  return (
    <div>
      <ReactHowler src={[Music]} playing={true} volume={volume} />
      {visible && 
      <div className='absolute top-0 left-0 flex justify-center h-screen w-full z-50 items-center bg-[rgba(0,0,0,0.5)] backdrop-blur-md'>
        <label htmlFor="volumeSlider">Volume:</label>
        <input
          type="range"
          id="volumeSlider"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={handleVolumeChange}
        />
        <span>{(volume * 100).toFixed(0)}%</span>
        <button onClick={()=>setVisible(!visible) } className="absolute px-4 py-2 border-2 rounded-full bottom-10">
            Close
        </button>
      </div>
}
    </div>
  );
};

export default AudioPlayer;
