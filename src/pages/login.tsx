import { EmailSignUpNewUser, EmailLogin, OAuthLogin } from "../supabase/Auth"
import { useState, useEffect } from "react"

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: ""
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const handleSignSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        EmailSignUpNewUser(form.email, form.password, form.name)
    }

    const handleLoginSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        EmailLogin(form.email, form.password)
    }


    return (
        <div className="">
            <div className="flex flex-col gap-10 h-full bg-black">
                <input type="text" name="email" id="email" value={form.email} onChange={handleChange} />
                <input type="password" name="password" id="password" value={form.password} onChange={handleChange} />
                <input type="text" name="name" id="name" value={form.name} onChange={handleChange} />
                <button onClick={handleSignSubmit} className="text-white">Signup</button>
                <button onClick={handleLoginSubmit} className="text-white">Login</button>
                <button onClick={() => OAuthLogin("google")} className="text-white">Google Login</button>
                <button onClick={() => OAuthLogin("github")} className="text-white">Github Login</button>
            </div>
        </div>
    )
}

export default Login