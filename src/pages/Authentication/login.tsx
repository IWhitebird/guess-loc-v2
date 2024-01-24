import { EmailSignUpNewUser, EmailLogin, OAuthLogin } from "../../supabase/Auth"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import StarsComp from "../../components/stars";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

function Auth() {
    const location = useNavigate()
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: ""
    })
    const [formState, setFormState] = useState("login")
    const [loading, setLoading] = useState(true)
    let localToken = localStorage.getItem('sb-pdnogztwriouxeskllgm-auth-token')

    useEffect(() => {
        if (localToken && JSON.parse(localToken).user.role) {
            location('/mode')
            setLoading(false)
        }else {
            setLoading(false)
        }
    }, [])

    const handleFormState = (state: string) => {
        setFormState(state)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const handleSignSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const load = toast.loading("Loading...")
        try {
            const newUser = await EmailSignUpNewUser(form.email, form.password, form.name)
    
            if (newUser === false) {
                toast.error("User already exists, please login")
            } else {
                toast.success("Check your email for verification")
            }
        } catch (error) {
            toast.error("User already exists, please login")
        } finally {
            toast.dismiss(load)
        }
    }

    const handleLoginSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const load = toast.loading("Loading...")
        try {
            event.preventDefault()
            const emailLogin = await EmailLogin(form.email, form.password)
            console.log(emailLogin)
        
            if (emailLogin) {
                toast.success("Logged in")
                window.location.href = "/mode"
            } else {
                toast.error("Invalid email or password")
            }
        } catch (error) {
            toast.error("Invalid email or password")
        } finally {
            toast.dismiss(load)
        }
    }


    return (
        <>
        <div className="px-5 flex items-center flex-col justify-center h-screen">
            <div className="absolute -z-10 w-[100vw] h-[100vh] bg-black">
                <Canvas>
                    <Suspense fallback={null}>
                    <StarsComp />
                    </Suspense>
                </Canvas>
            </div>
            {
                loading ? 
                (
                    <div className="flex justify-center items-center">
                        <ImSpinner2 className="animate-spin text-white text-6xl" />
                    </div>
                ) :
                (
                <div className="backdrop-blur-md bg-[#0f0913] border border-gray-500 p-10 rounded-2xl w-[500px]">
                    <h1 className="text-white text-3xl font-bold text-center">{formState === "login" ? "Login" : "Sign up"}</h1>
                    <form className="mt-6 flex flex-col gap-5">
                        {
                            formState === "signup" ? (
                                <>
                                    <label className="text-white text-xl">Name</label>
                                    <input className="p-2 rounded-md bg-transparent text-white border border-white" type="text" name="name" id="name" onChange={handleChange} />
                                </>
                            ) : null
                        }
                        <label className="text-white text-xl">Email</label>
                        <input className="p-2 rounded-md bg-transparent text-white border border-white" type="email" name="email" id="email" onChange={handleChange} />
                        <label className="text-white text-xl">Password</label>
                        <input className="p-2 rounded-md bg-transparent text-white border border-white" type="password" name="password" id="password" onChange={handleChange} />

                        {
                            formState === "signup" ? (
                                <>
                                    <button className="bg-transparent border border-white text-white py-2 mt-3 w-full rounded-xl flex justify-center items-center text-sm hover:scale-105 duration-300 " onClick={handleSignSubmit}>
                                        <span className="text-lg">Sign up</span>
                                    </button>
                                </>
                            ) : (
                                <button className="bg-transparent border border-white text-white py-2 mt-3 w-full rounded-xl flex justify-center items-center text-sm hover:scale-105 duration-300 " onClick={handleLoginSubmit}>
                                    <span className="text-lg">Login</span>
                                </button>
                            )
                        }
                    </form>
                    <div className=" grid grid-cols-3 my-5 items-center text-gray-500">
                        <hr className="" />
                        <p className="text-center text-sm">OR</p>
                        <hr className="" />
                    </div>
                    <button className="bg-transparent border border-white text-white py-2 w-full rounded-xl flex justify-center items-center text-sm hover:scale-105 duration-300" onClick={() => OAuthLogin("google")}>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-6 h-6" viewBox="0 0 48 48"><defs><path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" /></defs><clipPath id="b"><use xlinkHref="#a" overflow="visible" /></clipPath><path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" /><path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" /><path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" /><path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" /></svg>
                        <span className="ml-4 text-lg">Login with Google</span>
                    </button>
                    {
                        formState === "login" ? (
                            <p className="text-white text-center mt-5">Don't have an account? <button className="text-blue-500" onClick={() => handleFormState("signup")}>Sign up</button></p>
                        ) : (
                            <p className="text-white text-center mt-5">Already have an account? <button className="text-blue-500" onClick={() => handleFormState("login")}>Login</button></p>
                        )
                    }
                </div>
                )
            }
        </div>
        </>

    )
}

export default Auth