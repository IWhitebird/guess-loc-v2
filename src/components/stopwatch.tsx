import { useEffect, useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

const Stopwatch = ({ startTime, endTime ,endRound }: any) => {

  const [curTime, setCurTime] = useState<number>(
        moment(startTime).diff(new Date(), 'seconds') <= 0
      ? moment(endTime).diff(new Date(), 'seconds')
      : moment(startTime).diff(new Date(), 'seconds')
  );

  useEffect(() => {

    const intervalId = setInterval(() => {
        const now = new Date();

        const dif1 = moment(startTime).diff(now, 'seconds')
        const dif2 = moment(endTime).diff(now, 'seconds')

        const timeDifference = dif1 <= 0 ? dif2 : dif1
      
        if (timeDifference === 1) {
          setTimeout(() => {
            toast.success("Round Started!");
          }, 1000);
        }

        if (timeDifference <= 0) {1
          clearInterval(intervalId);
          endRound();
        }
      
        setCurTime(timeDifference);
      }, 1000);
      

    return () => clearInterval(intervalId);
  }, [startTime, endTime]);

  return (
    <div className='bg-pink-500 text-green-600 text-2xl'>
      {curTime}
    </div>
  );
};

export default Stopwatch;
