// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuário está logado, buscar seu papel no Firestore
        const userDocRef = doc(db, 'usuarios', user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role)
        } else {
          // Lógica para caso o usuário exista na Auth mas não no Firestore
          setUserRole(null) 
        }
        setCurrentUser(user)
      } else {
        // Usuário deslogado
        setCurrentUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userRole,
    loading,
  }

  // Não renderiza a aplicação até que o estado de autenticação seja verificado
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext)
}