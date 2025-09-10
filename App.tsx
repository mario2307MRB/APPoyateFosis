import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Briefcase, Users, HeartHandshake, Leaf, Quote } from "lucide-react";
// FIX: Imported Variants type from framer-motion to resolve typing issues.
import { motion, type Variants } from "framer-motion";

const programData = [
  { icon: <Briefcase className="h-8 w-8 text-primary group-hover:text-white transition-colors" />, title: "Yo Emprendo", description: "Apoyo a personas que quieren iniciar o fortalecer un pequeño negocio." },
  { icon: <Users className="h-8 w-8 text-primary group-hover:text-white transition-colors" />, title: "Apoyo Familiar", description: "Acompañamiento integral para familias en situación de vulnerabilidad." },
  { icon: <HeartHandshake className="h-8 w-8 text-primary group-hover:text-white transition-colors" />, title: "Acción", description: "Financiamiento para proyectos de organizaciones sociales y comunitarias." },
  { icon: <Leaf className="h-8 w-8 text-primary group-hover:text-white transition-colors" />, title: "Autoconsumo", description: "Iniciativas para que familias produzcan sus propios alimentos de forma sostenible." },
];

const testimonialsData = [
    { quote: "Gracias al FOSIS pude comprar las herramientas que necesitaba para mi taller. Mi negocio ha crecido y ahora puedo darle una mejor vida a mi familia.", name: "María González", program: "Yo Emprendo, Valparaíso" },
    { quote: "El programa de Autoconsumo nos enseñó a cultivar nuestra propia huerta. Ahora comemos más sano y ahorramos dinero. Ha sido un cambio increíble.", name: "Juan Pérez", program: "Autoconsumo, La Araucanía" },
    { quote: "Como junta de vecinos, logramos mejorar la plaza de nuestro barrio con el fondo del programa Acción. Ahora los niños tienen un lugar seguro para jugar.", name: "Ana Silva", program: "Acción, Coquimbo" }
];

// FIX: Explicitly typed framer-motion variants to resolve typing issues.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

// FIX: Explicitly typed framer-motion variants to resolve typing issues.
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function App() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-secondary/50 overflow-hidden">
          <div className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
            <motion.div className="space-y-6" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-fosis-blue-800">
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-fosis-blue-800 to-fosis-green-700">
                  Construyendo Oportunidades
                </span>, Superando la Pobreza
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Apoyamos a personas en situación de pobreza o vulnerabilidad, para que desarrollen sus capacidades, superen su condición y se integren plenamente a la sociedad.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="accent">Postula Aquí</Button>
                <Button size="lg" variant="outline">Conoce Nuestros Programas</Button>
              </div>
            </motion.div>
            <motion.div className="relative" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}>
              <motion.div
                animate={{ y: ["0%", "-3%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-background rounded-lg p-2 shadow-2xl border overflow-hidden ring-1 ring-primary/10">
                  <img src="https://www.fosis.gob.cl/uploads/noticias_1024x536_65f47d3e0b2eb.jpeg" alt="Persona beneficiaria de FOSIS" className="rounded-md object-cover aspect-video" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programas" className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Nuestros Programas</h2>
              <p className="mt-4 text-muted-foreground">
                Ofrecemos distintos programas de apoyo enfocados en el emprendimiento, la habitabilidad y el fortalecimiento comunitario.
              </p>
            </div>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              {programData.map((program, index) => (
                <motion.div key={index} variants={itemVariants} className="group">
                  <Card className="h-full text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-transparent hover:border-primary">
                    <CardHeader className="items-center">
                      <div className="bg-secondary p-4 rounded-full group-hover:bg-primary transition-all duration-300 group-hover:scale-110">
                        {program.icon}
                      </div>
                      <CardTitle className="mt-4">{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{program.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="impacto" className="py-20 md:py-28 bg-secondary/50">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Nuestro Impacto en las Personas</h2>
              <p className="mt-4 text-muted-foreground">
                Historias reales de esfuerzo y superación que nos inspiran a seguir trabajando.
              </p>
            </div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              {testimonialsData.map((testimonial, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full flex flex-col justify-between relative overflow-hidden bg-background/80 backdrop-blur-sm">
                     <Quote className="absolute -top-4 -left-4 h-24 w-24 text-secondary opacity-60" />
                    <CardContent className="pt-8 flex-1 z-10">
                      <blockquote className="italic text-muted-foreground">"{testimonial.quote}"</blockquote>
                    </CardContent>
                    <CardHeader className="z-10 bg-background/50 border-t">
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <p className="text-sm font-medium text-primary">{testimonial.program}</p>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}