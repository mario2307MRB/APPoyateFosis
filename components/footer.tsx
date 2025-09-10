import { Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-fosis-blue-950 text-slate-300" id="contacto">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
             <img src="https://www.fosis.gob.cl/assets/img/logo_main_white.png" alt="FOSIS Logo" className="h-12 bg-fosis-blue-800 p-2 rounded-md" />
            <p className="text-sm max-w-md text-slate-400">
              Fondo de Solidaridad e Inversión Social | Gobierno de Chile. Apoyamos a las personas para que desarrollen sus capacidades y superen su condición de pobreza.
            </p>
          </div>

          <div>
            <h3 className="font-semibold tracking-wider text-white">ENLACES</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Programas</a></li>
              <li><a href="#" className="hover:text-white">Transparencia</a></li>
              <li><a href="#" className="hover:text-white">Postulaciones</a></li>
              <li><a href="#" className="hover:text-white">Noticias</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold tracking-wider text-white">SÍGUENOS</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" aria-label="Facebook FOSIS" className="hover:text-white"><Facebook /></a>
              <a href="#" aria-label="Twitter FOSIS" className="hover:text-white"><Twitter /></a>
              <a href="#" aria-label="Youtube FOSIS" className="hover:text-white"><Youtube /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-fosis-blue-900 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} FOSIS - Fondo de Solidaridad e Inversión Social.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
