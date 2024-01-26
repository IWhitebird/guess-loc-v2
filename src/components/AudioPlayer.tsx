import { useEffect, useState, useRef } from 'react';
import ReactHowler from 'react-howler';
import Music from '../assets/music.mp3';
import { CiVolume, CiVolumeHigh, CiVolumeMute } from 'react-icons/ci';

interface props {
  audioSettings: boolean;
  setAudioSettings: (audioSettings: boolean) => void;
}

const AudioPlayer = ({ audioSettings, setAudioSettings }: props) => {
  const [volume, setVolume] = useState<number>(0.1);
  const [forceRender, setForceRender] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
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

    const handleOutsideClick = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAudioSettings(false);
      }
    }

    window.addEventListener('keydown', handleOutsideClick);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('keydown', handleOutsideClick);
    };
  }, [forceRender, settingsRef]); // Add forceRender to the dependency array

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    localStorage.setItem('volume', newVolume.toString());
  };

  return (
    <div>
      <ReactHowler src={[Music]} playing={true} volume={volume} />
      <div ref={settingsRef} className={`fixed duration-500 text-white ease-in-out flex justify-center h-screen w-full overflow-hidden z-50 items-center
       bg-[rgba(0,0,0,0.5)] backdrop-blur-md ${audioSettings ? 'opacity-100 top-0 left-0' : 'opacity-0 invisible top-[900px] left-0 '}`}>
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
          <button onClick={() => setAudioSettings(false)} id='fn_button'
            className="border-2 rounded-full bottom-0 hover:border-gray-500 hover:text-gray-400 duration-200"
            style={{ fontSize: '1.3rem', padding: '0.8rem 1.2rem' }}
          >
            Close<span id='fnButtonSpan'></span>
          </button>
        </div>
        <p className='absolute bottom-5 right-5 text-gray-400'>Press <span className='border text-md border-gray-500 rounded-lg p-0.5 mx-1'>Esc</span> to close</p>
      </div>
    </div>
  );
};

export default AudioPlayer;
