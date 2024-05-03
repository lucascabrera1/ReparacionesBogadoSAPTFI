import React from "react";
import { selectCurrentUser } from "../Features/AuthSlice";
import { useSelector } from "react-redux";

function Welcome() {
    const user = useSelector(selectCurrentUser)
    console.log(user)
    return (
        <div>
            {user ? 
                <div key={user._id}>
                    <h2>BIENVENIDO/A, {user.nombreUsuario} AL MENÚ PRINCIPAL DE REPARACIONES BOGADO</h2>
                    <h3>SELECCIONE LA SECCIÓN A LA QUE NECESITE INGRESAR</h3>
                    <h4>RECUERDE QUE SUS ROLES SON:</h4>
                    {
                        user.roles.map(rol => {
                            return <ul key={rol._id}>{rol.nombre}</ul>
                        })
                    }
                </div>:<div>
                    <h4>INICIE SESION PARA COMENZAR</h4>
                </div>
            }
        </div>
    )
}

export default Welcome;