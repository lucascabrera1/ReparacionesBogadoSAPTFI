import { selectCurrentToken } from "../Features/AuthSlice";
import { useSelector} from 'react-redux'
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const token = useSelector(selectCurrentToken)
    console.log("llega al protectedroute, abajo el token")
    console.log(token)
    console.log('fin token')
    if (token) return children
    else return <Navigate to = "/login" replace />
}

export default ProtectedRoute;