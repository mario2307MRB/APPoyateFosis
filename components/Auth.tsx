
import React, { useState } from 'react';
import type { User } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthProps {
    onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const [users, setUsers] = useLocalStorage<User[]>('fosis_users', []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            onLogin(user);
        } else {
            setError('Correo electrónico o contraseña incorrectos.');
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (users.some(u => u.email === email)) {
            setError('Este correo electrónico ya está registrado.');
            return;
        }
        
        const newUser: User = { id: new Date().toISOString(), email, password };
        setUsers([...users, newUser]);
        onLogin(newUser);
    };

    return (
        <div className="min-h-screen bg-fosis-blue flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <img src="https://www.fosis.gob.cl/assets/img/logo_main.png" alt="Logo FOSIS" className="mx-auto h-16 mb-6"/>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    {isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    {isLoginView ? 'Bienvenido de vuelta' : 'Únete a la plataforma'}
                </p>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}

                <form onSubmit={isLoginView ? handleLogin : handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fosis-blue"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-fosis-blue"
                            required
                        />
                    </div>
                    {!isLoginView && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-fosis-blue"
                                required
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <button className="bg-fosis-blue hover:bg-fosis-blue-dark text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full" type="submit">
                            {isLoginView ? 'Ingresar' : 'Registrarse'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-bold text-fosis-blue hover:text-fosis-blue-dark ml-2">
                        {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
