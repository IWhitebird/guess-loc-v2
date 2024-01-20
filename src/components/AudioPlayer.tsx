import React, { useEffect, useState } from 'react';
import ReactHowler from 'react-howler';
import Music from '../assets/music.mp3';
import { CiVolume, CiVolumeHigh, CiVolumeMute } from 'react-icons/ci';

interface props {
  visible: boolean;
  setVisible: any;
}

const AudioPlayer = ({ visible, setVisible }: props) => {
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
        setVolume(parseFloat(event.newValue || '0.4'));
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

  return (
    <div>
      <ReactHowler src={[Music]} playing={true} volume={volume} />
      <div className={`absolute duration-500 text-white ease-in-out top-0 left-0 flex justify-center h-screen w-full z-50 items-center bg-[rgba(0,0,0,0.5)] backdrop-blur-md ${visible ? 'opacity-100' : 'opacity-0 invisible'}`}>
        <label htmlFor="volumeSlider" className='mr-3 flex items-center gap-2'>
          Music Volume
          {volume === 0 ? <CiVolumeMute className="text-4xl text-white" /> : volume <= 0.5 ? <CiVolume className="text-3xl text-white" /> : <CiVolumeHigh className="text-3xl text-white" />}
        </label>
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
        <div className='absolute bottom-20'>
          <button onClick={() => setVisible(false)} id='fn_button' 
          className="border-2 rounded-full bottom-0 hover:border-gray-500 hover:text-gray-400 duration-200"
          style={{ fontSize: '1.3rem', padding: '1.2rem 2rem' }}
          >
            Close<span id='fnButtonSpan'></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
