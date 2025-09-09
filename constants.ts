
import type { QuizQuestion, FosisTip } from './types';

export const FOSIS_TASKS_POOL = [
  { title: "Revisar rendición de cuentas de proyecto 'Emprende Local'", durationHours: 3 },
  { title: "Preparar informe de avance semanal para la dirección", durationHours: 4 },
  { title: "Visita a terreno de supervisión al proyecto 'Mi Barrio'", durationHours: 6 },
  { title: "Capacitación a usuarios del programa 'Yo Trabajo'", durationHours: 8 },
  { title: "Responder correos y consultas administrativas", durationHours: 2 },
  { title: "Planificar actividades de la próxima semana", durationHours: 3 },
  { title: "Reunión de coordinación con equipo regional", durationHours: 2 },
  { title: "Elaborar bases técnicas para licitación de programa 'Acción'", durationHours: 8 },
  { title: "Evaluar 5 postulaciones de nuevos proyectos 'Innovación Social'", durationHours: 5 },
  { title: "Digitalizar expedientes de 3 convenios finalizados", durationHours: 4 },
  { title: "Asistir a reunión de coordinación intersectorial (Municipio)", durationHours: 3 },
  { title: "Realizar seguimiento telefónico a 10 usuarios", durationHours: 2 },
  { title: "Análisis de admisibilidad de nuevas propuestas", durationHours: 7 },
  { title: "Preparar presentación de resultados trimestrales", durationHours: 5 },
  { title: "Actualizar sistema de gestión de proyectos (SIGE)", durationHours: 2 },
  { title: "Taller de cierre con participantes de 'Apoyo Familiar'", durationHours: 6 },
  { title: "Revisión de presupuesto y flujo de caja de un proyecto", durationHours: 3 },
  { title: "Elaborar acta de reunión de equipo", durationHours: 1 },
  { title: "Sistematizar resultados de encuesta de satisfacción", durationHours: 4 },
  { title: "Gestionar compra de insumos para capacitación", durationHours: 2 },
];


export const FOSIS_TIPS: FosisTip[] = [
    {
        id: 1,
        title: "Planificación es Clave",
        content: "Una buena planificación del proyecto es el primer paso para el éxito. Define objetivos claros, actividades y plazos realistas desde el inicio."
    },
    {
        id: 2,
        title: "Rendiciones a Tiempo",
        content: "Mantén tus rendiciones de gastos al día. Un registro ordenado y puntual evita observaciones y agiliza los procesos de pago."
    },
    {
        id: 3,
        title: "Comunicación Fluida",
        content: "Establece una comunicación constante con tu contraparte FOSIS. Informar sobre avances y dificultades a tiempo permite encontrar soluciones conjuntas."
    },
    {
        id: 4,
        title: "Conoce las Bases",
        content: "Lee y comprende a fondo las bases técnicas y administrativas de tu convenio. La mayoría de las dudas se resuelven allí."
    },
    {
        id: 5,
        title: "Respalda tu Trabajo",
        content: "Documenta todo. Fotografías, listas de asistencia y actas de reuniones son verificadores cruciales para demostrar la ejecución de tu proyecto."
    }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        question: "¿Qué significa FOSIS?",
        options: ["Fondo de Solidaridad e Inversión Social", "Fundación para la Superación de la Pobreza", "Fondo Social de Inversiones", "Federación de Organizaciones Sociales"],
        correctAnswer: "Fondo de Solidaridad e Inversión Social"
    },
    {
        question: "¿Cuál es el objetivo principal del FOSIS?",
        options: ["Entregar bonos directos a las familias", "Contribuir a la superación de la pobreza y vulnerabilidad", "Construir viviendas sociales", "Administrar los fondos de pensiones"],
        correctAnswer: "Contribuir a la superación de la pobreza y vulnerabilidad"
    },
    {
        question: "¿A qué ministerio está relacionado el FOSIS?",
        options: ["Ministerio de Hacienda", "Ministerio de Educación", "Ministerio de Desarrollo Social y Familia", "Ministerio de Vivienda y Urbanismo"],
        correctAnswer: "Ministerio de Desarrollo Social y Familia"
    },
    {
        question: "El programa 'Yo Emprendo' del FOSIS está enfocado en:",
        options: ["Apoyar a personas que quieren mejorar su vivienda", "Apoyar a personas que quieren iniciar o fortalecer un pequeño negocio", "Entregar becas de estudio", "Fomentar el deporte en barrios"],
        correctAnswer: "Apoyar a personas que quieren iniciar o fortalecer un pequeño negocio"
    },
    {
        question: "¿Qué es un 'Ejecutor Intermedio' en un proyecto FOSIS?",
        options: ["El participante del programa", "Una institución pública o privada que implementa el proyecto", "Un funcionario del FOSIS", "El Ministro de Desarrollo Social"],
        correctAnswer: "Una institución pública o privada que implementa el proyecto"
    },
    {
        question: "El plazo para la rendición de cuentas de un proyecto FOSIS es generalmente:",
        options: ["Semanal", "Mensual", "Anual", "Al final del proyecto"],
        correctAnswer: "Mensual"
    },
    {
        question: "La 'Garantía de Fiel Cumplimiento' en un convenio FOSIS busca:",
        options: ["Asegurar que el ejecutor termine el proyecto", "Pagar los sueldos del equipo", "Garantizar la calidad de los materiales", "Cubrir gastos de imprevistos"],
        correctAnswer: "Asegurar que el ejecutor termine el proyecto"
    },
    // Adding more questions to have a larger pool
    {
        question: "¿Qué tipo de apoyo entrega el programa 'Acción' del FOSIS?",
        options: ["Apoyo a organizaciones sociales para proyectos comunitarios", "Créditos para microempresas", "Subsidios de arriendo", "Becas de alimentación"],
        correctAnswer: "Apoyo a organizaciones sociales para proyectos comunitarios"
    },
    {
        question: "Un 'Plan de Negocios' es un requisito fundamental para el programa:",
        options: ["Habitabilidad", "Yo Emprendo", "Vínculos", "Autoconsumo"],
        correctAnswer: "Yo Emprendo"
    },
    {
        question: "¿Qué es el 'SIGE' en el contexto de FOSIS?",
        options: ["Sistema de Información y Gestión de Ejecución", "Sindicato General de Empleados", "Servicio de Impuestos y Garantías", "Sistema Integrado de Gestión Educacional"],
        correctAnswer: "Sistema de Información y Gestión de Ejecución"
    },
    {
        question: "¿El FOSIS solo opera en la Región Metropolitana?",
        options: ["Sí, solo en Santiago", "No, tiene presencia en todas las regiones del país", "Solo en capitales regionales", "Solo en zonas rurales"],
        correctAnswer: "No, tiene presencia en todas las regiones del país"
    },
    {
        question: "El concepto de 'graduación' en un programa FOSIS se refiere a:",
        options: ["Terminar la enseñanza media", "Completar exitosamente la participación en el programa", "Recibir un diploma universitario", "Jubilarse del trabajo"],
        correctAnswer: "Completar exitosamente la participación en el programa"
    },
    {
        question: "¿Cuál de estos NO es un componente típico de un proyecto FOSIS?",
        options: ["Capacitación", "Financiamiento de un plan de negocio", "Acompañamiento técnico", "Construcción de carreteras"],
        correctAnswer: "Construcción de carreteras"
    },
    {
        question: "El Registro Social de Hogares (RSH) es importante para postular a FOSIS porque:",
        options: ["No tiene ninguna importancia", "Determina el nivel de vulnerabilidad de las familias", "Es un requisito para obtener la cédula de identidad", "Define el color político de la persona"],
        correctAnswer: "Determina el nivel de vulnerabilidad de las familias"
    },
    {
        question: "La 'ley FOSIS' puede reemplazar a la garantía de:",
        options: ["Fiel Cumplimiento", "Anticipo", "Calidad de la obra", "Responsabilidad civil"],
        correctAnswer: "Anticipo"
    }
];