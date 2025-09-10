import { NextResponse } from 'next/server';

// Ejemplo de datos de programas que podrían venir de una base de datos.
const programs = [
    {
        id: "emprende",
        name: "Yo Emprendo",
        description: "Apoyo a personas que quieren iniciar o fortalecer un pequeño negocio.",
        icon: "Briefcase" 
    },
    {
        id: "familia",
        name: "Apoyo Familiar",
        description: "Acompañamiento integral para familias en situación de vulnerabilidad.",
        icon: "Users"
    },
    {
        id: "accion",
        name: "Acción",
        description: "Financiamiento para proyectos de organizaciones sociales y comunitarias.",
        icon: "HeartHandshake"
    },
    {
        id: "autoconsumo",
        name: "Autoconsumo",
        description: "Iniciativas para que familias produzcan sus propios alimentos de forma sostenible.",
        icon: "Leaf"
    },
];

export async function GET() {
  try {
    // En una aplicación real, aquí se realizaría una consulta a una base de datos.
    // await db.connect();
    // const programs = await ProgramModel.find({});
    
    return NextResponse.json(programs, { status: 200 });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
