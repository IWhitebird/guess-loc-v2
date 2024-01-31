import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store/store";
import { setGame, removeGame, updateRoundDetails, updateRoundStartTime, updateCurRound } from "../../redux/slices/gameSlice";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase/init";
import { toast } from "react-hot-toast";
import moment from 'moment';
import Stopwatch from "../../components/stopwatch";
import Scoreboard from "../../components/Multiplayer Components/Scoreboard";
import { ImSpinner2 } from "react-icons/im";
import ChatModel from "../../components/chatmodel";
import { FaChevronCircleUp } from "react-icons/fa";

const MultiPlayer = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const game = useSelector((state: RootState) => state.game)
  const user = useSelector((state: RootState) => state.user)
  const room = useSelector((state: RootState) => state.room)

  const [guessLat, setGuessLat] = useState<number>(0)
  const [guessLng, setGuessLng] = useState<number>(0)
  const [guessDistance, setGuessDistance] = useState<number>(0)
  const [userPoints, setUserPoints] = useState<number>(0)
  const [chatModal, setChatModal] = useState<boolean>(false)

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [readyUsers, setReadyUsers] = useState<Set<String>>(new Set())
  const channel1 = supabase.channel(`${game.game_id}_game`)
  const channel2 = supabase.channel(`${game.game_id}`)
  let marker: any;

  async function getGame() {

    const { data, error }: any = await supabase.from('game')
      .select()
      .eq('game_id', room.cur_game_id)

    if (error) {
      toast.error("Failed to start game")
      navigate('/dashboard')
    }
    localStorage.setItem('custom_game_details', JSON.stringify(data[0]))
    dispatch(setGame(data[0]))

    channel1
      .on('presence', { event: 'sync' }, () => {
        const newState: any = channel1.presenceState()

        let ready = new Set<String>()

        for (const key in newState) {
          ready.add(newState[key][0].userId)
        }
        setReadyUsers(ready)
      })
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') return;
        channel1.track({ userId: user.user_id })
      })

    return;
  }

  async function startRound() {
    if (user.user_id === room.room_owner && readyUsers.size === room.room_participants.length) {
      const timeToAdd = game.round_duration + 10
      await supabase
        .from('game')
        .update({
          cur_round: game.cur_round ? game.cur_round + 1 : 1,
          cur_round_start_time: moment(new Date()).add(timeToAdd, 'seconds').toISOString()
        })
        .eq('game_id', game.game_id)
    }
  }

  async function endGame() {
    console.log("END GAME")
  }

  async function endRound() {
    toast.success("Round Ended!");
    dispatch(setGame({
      ...game,
      cur_round_start_time: null
    }))
    fetchResults()
  }

  async function fetchResults() {
    console.log("fetching results")
  }

  async function guessLatLng(guessLat: string, guessLng: string) {
    const usrDetails = {
      user_id: user.user_id,
      guess_lat: guessLat,
      guess_lng: guessLng,
      user_distance: guessDistance,
      user_points: userPoints
    };

    const { data, error } = await supabase
      .from('game')
      .update([...game.round_details, usrDetails])
      .eq('game_id', game.game_id);

    if (error) {
      console.error('Error updating game:', error);
    } else {
      console.log('Game updated successfully:', data);
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

  useEffect(() => {
    const loadGoogleMapScript = () => {
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
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "landscape",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "administrative.country",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "administrative.locality",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      };

      const map = new window.google.maps.Map(
        mapContainerRef.current,
        mapOptions
      );

      mapRef.current = map;

      window.google.maps.event.addListener(map, "mousemove", function () {
        map.setOptions({ draggableCursor: "crosshair" });
      });

      map.addListener("click", (event: any) => {
        placeMarker(event.latLng.lat(), event.latLng.lng());
      });
    };

    if (!window.google) {
      loadGoogleMapScript();
    } else {
      initMap();
    }
  }, []);

  const placeMarker = (eventLat: number, eventLng: number) => {
    console.log(eventLat, eventLng)
    if (marker) {
      marker.setPosition({ lat: eventLat, lng: eventLng });
    } else {
      marker = new window.google.maps.Marker({
        position: { lat: eventLat, lng: eventLng },
        map: mapRef.current
      })
    }
    setGuessLat(eventLat);
    setGuessLng(eventLng);
  }

  let timeRemaining = '00:12'

  return (
    <div className="overflow-hidden">
      <Scoreboard />
      <div className={`fixed duration-300 ${chatModal ? 'bottom-0' : 'bottom-[-31.2rem]'} left-0 z-50 h-[500px] backdrop-blur-3xl bg-[rgba(0,0,0,0.5)] `}>
        <div className="flex absolute bottom-[31.25rem] backdrop-blur-3xl text-white bg-[rgba(0,0,0,0.5)] rounded-tr-xl flex-col
         w-full items-end p-2 text-2xl cursor-pointer"
          onClick={() => setChatModal(!chatModal)}>
          <p className={`flex justify-between w-full items-center px-3`}>Chat <span className={`${chatModal ? 'rotate-180' : ''} `}><FaChevronCircleUp /></span></p>
        </div>
        <ChatModel />
      </div>
      <div className="absolute bottom-0 right-24 text-sm opacity-50"> {room.cur_game_id}</div>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center z-40 items-center bg-[rgba(0,0,0,0.2)]">
        <div className="text-2xl p-5 flex flex-col gap-2 items-center rounded-xl bg-[rgba(0,0,0,0.3)]">
          <span className="">Game starts in 02</span>
          <div className="flex gap-3 items-center text-base">Waiting for players ({readyUsers.size}/{room.room_participants.length})</div>
          <ImSpinner2 className="animate-spin" />
        </div>
      </div>

      {
        game.cur_round_start_time !== null &&
        <Stopwatch
          startTime={moment(game.cur_round_start_time).subtract(game.round_duration, 'seconds').toISOString()}
          endTime={game.cur_round_start_time}
          endRound={endRound}
        />
      }
      <div className="absolute z-10 w-full">
        <div className="flex justify-center items-center mt-5">
          <div
            className={`rounded-full gap-10 text-xl text-white px-5 py-2
             ${timeRemaining <= '00:10' ? 'bg-red-500 border border-red-500 animate-pulse' : 'bg-purple-900 border border-purple-500'
              }`}
          >
            {timeRemaining}
          </div>
        </div>

      </div>

      <div className="absolute h-[200px] w-[300px] hover:w-[500px] hover:h-[300px] hover:opacity-100 border z-40 right-10 bottom-20 transition-all duration-200 ease-in-out opacity-50 cursor-crosshair" ref={mapContainerRef}></div>
      <div className="absolute bottom-6 right-32">
        <button className="bg-red-500 px-5 py-2 rounded-xl">
          Guess
        </button>
      </div>

      <button className="bg-black w-10" onClick={
        () => {
          if (game.cur_round === game.total_rounds) {
            endGame()
          } else {
            startRound()
          }
        }}>Start
      </button>
    </div >
  )
}

export default MultiPlayer