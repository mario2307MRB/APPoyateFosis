"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Users, HeartHandshake, Leaf, Quote, type LucideProps } from "lucide-react";
import React, { useState, useEffect } from 'react';

// Type for program data from API
interface Program {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Map icon names from API to actual components
const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Briefcase: Briefcase,
  Users: Users,
  HeartHandshake: HeartHandshake,
  Leaf: Leaf,
};

const testimonialsData = [
    { quote: "Gracias al FOSIS pude comprar las herramientas que necesitaba para mi taller. Mi negocio ha crecido y ahora puedo darle una mejor vida a mi familia.", name: "María González", program: "Yo Emprendo, Valparaíso" },
    { quote: "El programa de Autoconsumo nos enseñó a cultivar nuestra propia huerta. Ahora comemos más sano y ahorramos dinero. Ha sido un cambio increíble.", name: "Juan Pérez", program: "Autoconsumo, La Araucanía" },
    { quote: "Como junta de vecinos, logramos mejorar la plaza de nuestro barrio con el fondo del programa Acción. Ahora los niños tienen un lugar seguro para jugar.", name: "Ana Silva", program: "Acción, Coquimbo" }
];

export default function HomePage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/programs');
        if (!response.ok) {
          throw new Error('Error al cargar los programas');
        }
        const data = await response.json();
        setPrograms(data);
      } catch (err) {
        setError('No se pudieron cargar los programas en este momento. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const renderProgramCards = () => {
    if (loading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={index}>
            <Card className="h-full text-center">
              <CardHeader className="items-center">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-6 w-32 mt-4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mx-auto" />
              </CardContent>
            </Card>
        </div>
      ));
    }

    if (error) {
      return <p className="col-span-full text-center text-destructive">{error}</p>;
    }

    return programs.map((program) => {
        const ProgramIcon = iconMap[program.icon] || Briefcase;
        return (
            <div key={program.id} className="group">
                <Card className="h-full text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-transparent hover:border-primary">
                    <CardHeader className="items-center">
                        <div className="bg-secondary p-4 rounded-full group-hover:bg-primary transition-all duration-300 group-hover:scale-110">
                            <ProgramIcon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <CardTitle className="mt-4">{program.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{program.description}</p>
                    </CardContent>
                </Card>
            </div>
        )
    });
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-secondary/50 overflow-hidden">
        <div className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          <div className="space-y-6">
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
          </div>
          <div className="relative">
            <div>
              <div className="bg-background rounded-lg p-2 shadow-2xl border overflow-hidden ring-1 ring-primary/10">
                <img src="https://www.fosis.gob.cl/uploads/noticias_1024x536_65f47d3e0b2eb.jpeg" alt="Persona beneficiaria de FOSIS" className="rounded-md object-cover aspect-video" />
              </div>
            </div>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {renderProgramCards()}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <div key={index}>
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}