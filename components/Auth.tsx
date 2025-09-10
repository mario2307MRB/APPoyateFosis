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
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
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
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-soft-xl p-8 sm:p-12 transition-all border border-white/20 dark:border-white/10 animate-fade-in-up">
                <img src="https://www.fosis.gob.cl/assets/img/logo_main.png" alt="Logo FOSIS" className="mx-auto h-20 mb-6 dark:invert-[0.15] dark:brightness-200"/>
                <h2 className="text-3xl font-bold text-center text-fosis-blue-900 dark:text-white mb-2">
                    {isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-center text-slate-600 dark:text-slate-300 mb-8">
                    {isLoginView ? 'Bienvenido de vuelta a tu gestor de proyectos.' : 'Únete a la plataforma para comenzar.'}
                </p>

                {error && <div className="bg-red-500/20 border border-red-500/30 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

                <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/50 dark:bg-slate-800/50 appearance-none border border-slate-300 dark:border-slate-700 rounded-lg w-full py-3 px-4 text-slate-800 dark:text-slate-100 leading-tight focus:outline-none focus:ring-2 focus:ring-fosis-blue-700 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/50 dark:bg-slate-800/50 appearance-none border border-slate-300 dark:border-slate-700 rounded-lg w-full py-3 px-4 text-slate-800 dark:text-slate-100 leading-tight focus:outline-none focus:ring-2 focus:ring-fosis-blue-700 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            required
                        />
                    </div>
                    {!isLoginView && (
                        <div>
                            <label className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-white/50 dark:bg-slate-800/50 appearance-none border border-slate-300 dark:border-slate-700 rounded-lg w-full py-3 px-4 text-slate-800 dark:text-slate-100 leading-tight focus:outline-none focus:ring-2 focus:ring-fosis-blue-700 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                required
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                        <button className="bg-fosis-blue-800 hover:bg-fosis-blue-900 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus-visible:ring-4 ring-fosis-blue-500 ring-offset-2 dark:ring-offset-slate-900 w-full transition-transform transform hover:scale-105 shadow-lg" type="submit">
                            {isLoginView ? 'Ingresar' : 'Registrarse'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-slate-600 dark:text-slate-300 text-sm mt-8">
                    {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-bold text-fosis-blue-800 hover:text-fosis-blue-900 dark:text-fosis-blue-400 dark:hover:text-fosis-blue-300 ml-2 transition-colors">
                        {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;