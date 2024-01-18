import { useEffect } from "react"

function Verify() {
    useEffect(() => {
        setTimeout(() => {
            window.location.href = "/mode"
        }, 2000)
    }, [])
    return (
        <div>V</div>
    )
}

export default Verify