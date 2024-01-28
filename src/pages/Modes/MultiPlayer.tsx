import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store/store";
import { setGame, removeGame, updateRoundDetails, updateRoundStartTime, updateCurRound } from "../../redux/slices/gameSlice";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase/init";
import { toast } from "react-hot-toast";
import moment from 'moment';
import Stopwatch from "../../components/stopwatch";

const MultiPlayer = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const game = useSelector((state: RootState) => state.game)
  const user = useSelector((state: RootState) => state.user)
  const room = useSelector((state: RootState) => state.room)

  const [readyUsers, setReadyUsers] = useState<Set<String>>(new Set())
  const channel1 = supabase.channel(`${game.game_id}_game`)
  const channel2 = supabase.channel(`${game.game_id}`)


  async function getGame() {

    const {data ,error} : any = await supabase.from('game')
    .select()
    .eq('game_id', room.cur_game_id)

    if(error) {
      toast.error("Failed to start game")
      navigate('/dashboard')
    }
    localStorage.setItem('custom_game_details', JSON.stringify(data[0]))
    dispatch(setGame(data[0]))

    channel1
    .on('presence', { event: 'sync' }, () => {
      const newState : any = channel1.presenceState()

      let ready = new Set<String>()

      for(const key in newState) {
        ready.add(newState[key][0].userId)
      }

      setReadyUsers(ready)
    })
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED') return;
      channel1.track({ userId : user.user_id })
    })

    return;
  }

  async function startGame() {
    if(user.user_id === room.room_owner && readyUsers.size === room.room_participants.length) {
      const timeToAdd = game.round_duration + 10
      await supabase
      .from('game')
      .update({
        cur_round : 2,
        cur_round_start_time : moment(new Date()).add(timeToAdd, 'seconds').toISOString()
      })
      .eq('game_id', game.game_id)
    }
  }


  useEffect(() => {
      getGame();
  }, []);


  channel2
  .on('postgres_changes',
  {
    event: 'UPDATE',
    schema: 'public',
    table: 'game',
    filter: `game_id=eq.${game.game_id}`
  },
  payload => {
    console.log("HEREEEEEEEEEEEEEEEEEEE", payload)
    dispatch(setGame(payload.new as any))
  }
  ).subscribe()

  return (
    <div>
      
      {
        game.cur_round_start_time !== null &&
        <Stopwatch 
        startTime={moment(game.cur_round_start_time).subtract(game.round_duration, 'seconds').toISOString()} 
        endTime={game.cur_round_start_time} />
      }

      <button className="bg-black w-10" onClick={startGame}>Start</button>

    </div>
  )
}

export default MultiPlayer