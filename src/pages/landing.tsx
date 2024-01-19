import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./landing.css";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Earth from "../components/earth";
import logo from "../assets/Untitled-1.png";
import { CheckUser } from "../supabase/Auth";
import { ImSpinner2 } from "react-icons/im";

const Landing = () => {
  const location = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await CheckUser()
        setLoading(false)
        if (user?.aud === "authenticated") {
          location("/mode")
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    checkLogin()
  }, [])

  return (
    <>
      {loading ? (
        <div className="flex justify-center z-50 items-center bg-black h-screen">
          <ImSpinner2 className="animate-spin text-white text-6xl" />
        </div>
      ) : (<>

        <div className="relative w-[100vw] h-[100vh] bg-black">
          <Canvas>
            <Suspense fallback={null}>
              <Earth />
            </Suspense>
          </Canvas>
        </div>


        <div className="absolute w-[100vw] h-[100vh] top-0">

          <div className="flex justify-between absolute w-full px-24">
            <h4>
              <img src={logo} alt="logo" className="invert w-[200px]" />
            </h4>
            <div className="flex items-center">
              <Link to="/auth" className="text-white text-2xl border border-white rounded-full px-5 py-2 transition-all ease-in-out duration-300 hover:border-r-8 ">
                Login
              </Link>
            </div>
          </div>
          <div className="flex w-[100vw] h-[100vh] overflow-hidden main ">

            <div className="flex justify-end w-full items-center mt-28">
              <div className="text-white w-[40%] px-3">
                <h1 className="text-4xl font-Raleway text-white mb-2">
                  Embark on a global adventure!
                </h1>
                <ul
                  className="p-2 text-xl font-Raleway "
                  style={{ listStyleType: "none" }}
                >
                  <li className="p-2">
                    Experience a seamless transition from the vibrant urban landscape of Tokyo to the idyllic and picturesque beaches of Bali, where tranquility meets the energy of a bustling metropolis.
                  </li>
                  <ul>
                    <li className="p-2 mt-3 text-4xl">
                      How it works?
                    </li>
                    <li className="p-2">
                      The closer your guess is, the more points you will earn.
                    </li>
                    <li className="p-2">
                      You will have 5 rounds; after 5 rounds, your max score will be
                      determined.
                    </li>
                    <li className="p-2">
                      If you run out of time while guessing, you will get 0 points
                      for that round.
                    </li>
                  </ul>
                </ul>
                <div className="px-[15rem] py-10">
                  <Link to="/register" className="op_button">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Play Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>)}
    </>
  );
};

export default Landing;
