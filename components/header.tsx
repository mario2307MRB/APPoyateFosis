"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
    { label: "Programas", href: "#programas" },
    { label: "Impacto", href: "#impacto" },
    { label: "Contacto", href: "#contacto" },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
                <a href="/" className="flex items-center gap-2">
                    <img src="https://www.fosis.gob.cl/assets/img/logo_main.png" alt="FOSIS Logo" className="h-10" />
                </a>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {navItems.map((item) => (
                        <a key={item.href} href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                     <Button variant="outline" className="hidden sm:inline-flex">
                        Acceso Usuarios
                    </Button>
                    <button
                        className="p-2 md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                 <div className="md:hidden bg-background border-t">
                    <nav className="flex flex-col items-center gap-4 p-4">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="w-full text-center p-2 rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        ))}
                         <Button variant="outline" className="w-full">
                            Acceso Usuarios
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;