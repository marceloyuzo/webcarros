import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import logoImg from "../../assets/logo.svg"
import { Link } from "react-router-dom"
import { FiUser, FiLogIn, FiLogOut } from "react-icons/fi"
import { signOut } from "firebase/auth"
import { auth } from "../../services/firebaseConnection"

export function Header() {
   const { signed, loadingAuth } = useContext(AuthContext)

   async function handleLogout() {
      await signOut(auth)
   }

   return(
      <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
         <header className="w-full max-w-7xl flex items-center justify-between px-6 mx-auto ">
            <Link to="/">
               <img 
                  src={logoImg} 
                  alt="Logo do Site"
               />
            </Link>

            {!loadingAuth && signed && (
               <div className="flex items-center justify-center gap-4">

                  <Link to="/dashboard">
                     <div className="border-2 rounded-full p-1 border-gray-900">
                        <FiUser size={24} color="#000" />
                     </div>
                  </Link>

                  <button onClick={handleLogout}>
                     <FiLogOut size={24} color="#000"/>
                     
                  </button>
               </div>

            )}

            {!loadingAuth && !signed && (
               <Link to="/login">
                  <div className="border-2 rounded-full p-1 border-gray-900">
                     <FiLogIn size={24} color="#000" />
                  </div>
                  
               </Link>
            )}
         </header>

      </div>
   )
}