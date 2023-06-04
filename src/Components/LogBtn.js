import { useEffect } from "react";
import { useNavigate } from "react-router-dom"


function LogBtn (props) {
    const navigation = useNavigate();

    const handleLogin = () => {
        navigation("/login", { replace: true });
    }

    useEffect(() => {
        navigation("/login", { replace: true });
    }, [])

    return (
        <div className="logBtn">
            <button type="button" onClick={handleLogin}>Log In</button>
        </div>
    )
}

export default LogBtn