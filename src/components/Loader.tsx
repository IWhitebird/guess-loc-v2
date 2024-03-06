import { ImSpinner2 } from 'react-icons/im'

function Loader() {
    return (
        <div className="flex absolute top-0 left-0 w-full z-40 justify-center items-center h-full">
            <ImSpinner2 className="animate-spin text-white text-6xl" />
        </div>
    )
}

export default Loader