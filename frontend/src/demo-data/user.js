export const demoUser = {
  id: 'demo-user',
  name: 'Alessandro Rossi',
  email: 'demo@edilconnect.it',
  profession: 'Architetto',
  company: 'Studio Rossi Architetti',
  role: 'Project Manager',
  joinDate: '2023-12-01',
  settings: {
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    projectUpdatesNotifications: true,
    deadlineNotifications: true,
    documentNotifications: true,
    
    language: 'it',
    theme: 'light',
    resolution: '1920x1080',
    dateFormat: 'dd/MM/yyyy',
    currencyFormat: '€',
    measurementUnit: 'metric',
    
    profileVisibility: 'public',
    showContactInfo: true,
    showPortfolio: true,
    twoFactorEnabled: false,
    
    calendarSync: true,
    googleDriveSync: false,
    dropboxSync: false,
    
    defaultPdfScale: '1:100',
    autoSaveInterval: 5,
    fileNamingConvention: 'project-date-version'
  },
  stats: {
    totalProjects: 12,
    activeProjects: 5,
    completedProjects: 7,
    documentsUploaded: 45,
    teamMembers: 8
  }
}; 