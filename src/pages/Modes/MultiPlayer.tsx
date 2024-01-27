import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store/store";
import { setGame, removeGame, updateRoundDetails, updateRoundStartTime, updateCurRound } from "../../redux/slices/gameSlice";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase/init";
import { toast } from "react-hot-toast";

const MultiPlayer = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const game = useSelector((state: RootState) => state.game)
  const room = useSelector((state: RootState) => state.room)

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
    console.log(data)
    return;
  }

  useEffect(() => {
    getGame();
  }, []);


  return (
    <div>
      
    </div>
  )
}

export default MultiPlayer