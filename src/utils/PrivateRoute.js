import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase'; // Certifique-se de importar corretamente o auth

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Define `true` se o usuário estiver logado
    });
    return () => unsubscribe(); // Limpa o listener ao desmontar o componente
  }, []);

  if (isAuthenticated === null) {
    // Mostra um carregamento enquanto verifica a autenticação
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
