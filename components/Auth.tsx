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
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-fosis-blue-50/20 via-white to-fosis-green-50/20">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-soft-xl p-8 sm:p-12 transition-all border border-slate-200">
                <img src="https://www.fosis.gob.cl/assets/img/logo_main.png" alt="Logo FOSIS" className="mx-auto h-20 mb-6"/>
                <h2 className="text-3xl font-bold text-center text-fosis-blue-900 mb-2">
                    {isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-center text-slate-500 mb-8">
                    {isLoginView ? 'Bienvenido de vuelta a tu gestor de proyectos.' : 'Únete a la plataforma para comenzar.'}
                </p>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

                <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow-soft appearance-none border border-slate-300 rounded-lg w-full py-3 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fosis-blue-700 transition-shadow"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-soft appearance-none border border-slate-300 rounded-lg w-full py-3 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fosis-blue-700 transition-shadow"
                            required
                        />
                    </div>
                    {!isLoginView && (
                        <div>
                            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="shadow-soft appearance-none border border-slate-300 rounded-lg w-full py-3 px-4 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-fosis-blue-700 transition-shadow"
                                required
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                        <button className="bg-fosis-blue-800 hover:bg-fosis-blue-900 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition-transform transform hover:scale-105 shadow-soft-lg hover:shadow-xl" type="submit">
                            {isLoginView ? 'Ingresar' : 'Registrarse'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-slate-500 text-sm mt-8">
                    {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-bold text-fosis-blue-800 hover:text-fosis-blue-900 ml-2 transition-colors">
                        {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;