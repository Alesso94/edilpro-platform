export const demoProjects = [
  {
    id: 'demo1',
    name: 'Ristrutturazione Villa Moderna',
    description: 'Progetto di ristrutturazione completa di una villa storica con elementi di design moderno',
    client: 'Studio Rossi Architetti',
    status: 'In Corso',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    budget: 450000,
    address: 'Via dei Giardini 45',
    city: 'Milano',
    team: [
      { id: 1, name: 'Marco Rossi', role: 'Architetto Capo' },
      { id: 2, name: 'Laura Bianchi', role: 'Ingegnere Strutturale' },
      { id: 3, name: 'Giovanni Verdi', role: 'Geometra' }
    ],
    tasks: [
      { id: 1, name: 'Analisi strutturale', status: 'Completato', progress: 100 },
      { id: 2, name: 'Progettazione interni', status: 'In Corso', progress: 75 },
      { id: 3, name: 'Permessi edilizi', status: 'In Corso', progress: 50 }
    ]
  },
  {
    id: 'demo2',
    name: 'Complesso Residenziale Green Living',
    description: 'Nuovo complesso residenziale eco-sostenibile con 20 unità abitative',
    client: 'GreenBuild SpA',
    status: 'In Attesa',
    progress: 25,
    startDate: '2024-03-01',
    endDate: '2025-04-30',
    budget: 2800000,
    address: 'Via dell\'Innovazione 12',
    city: 'Roma',
    team: [
      { id: 4, name: 'Paolo Neri', role: 'Project Manager' },
      { id: 5, name: 'Sofia Romano', role: 'Architetto Paesaggista' }
    ],
    tasks: [
      { id: 4, name: 'Studio di fattibilità', status: 'Completato', progress: 100 },
      { id: 5, name: 'Progettazione preliminare', status: 'In Corso', progress: 60 }
    ]
  },
  {
    id: 'demo3',
    name: 'Restauro Palazzo Storico',
    description: 'Intervento di restauro conservativo su palazzo del XVIII secolo',
    client: 'Comune di Firenze',
    status: 'Completato',
    progress: 100,
    startDate: '2023-06-01',
    endDate: '2024-02-28',
    budget: 1200000,
    address: 'Piazza della Signoria 8',
    city: 'Firenze',
    team: [
      { id: 6, name: 'Elena Martini', role: 'Restauratrice' },
      { id: 7, name: 'Andrea Conti', role: 'Storico dell\'Arte' }
    ],
    tasks: [
      { id: 6, name: 'Restauro facciate', status: 'Completato', progress: 100 },
      { id: 7, name: 'Consolidamento strutturale', status: 'Completato', progress: 100 }
    ]
  }
]; 