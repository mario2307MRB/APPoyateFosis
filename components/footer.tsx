import Link from 'next/link';
import { Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-secondary" id="contacto">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
             <img src="https://www.fosis.gob.cl/assets/img/logo_main_white.png" alt="FOSIS Logo" className="h-12 bg-fosis-blue-800 p-2 rounded-md" />
            <p className="text-muted-foreground text-sm max-w-md">
              Fondo de Solidaridad e Inversión Social | Gobierno de Chile. Apoyamos a las personas para que desarrollen sus capacidades y superen su condición de pobreza.
            </p>
          </div>

          <div>
            <h3 className="font-semibold tracking-wider text-foreground">ENLACES</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Programas</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Transparencia</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Postulaciones</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Noticias</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold tracking-wider text-foreground">SÍGUENOS</h3>
            <div className="mt-4 flex space-x-4">
              <Link href="#" aria-label="Facebook FOSIS" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
              <Link href="#" aria-label="Twitter FOSIS" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
              <Link href="#" aria-label="Youtube FOSIS" className="text-muted-foreground hover:text-primary"><Youtube /></Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FOSIS - Fondo de Solidaridad e Inversión Social.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
