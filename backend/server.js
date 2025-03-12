const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'edilizia-platform-secret-key'; // In produzione, usare variabile d'ambiente

app.use(cors());
app.use(bodyParser.json());

// Configurazione storage per i file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.params.type || 'documents';
        const dir = path.join(__dirname, 'uploads', type);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Database simulato
let projects = [
    {
        id: 1,
        title: 'Ristrutturazione Villa',
        description: 'Ristrutturazione completa di una villa storica',
        startDate: '2024-03-01',
        endDate: '2024-06-30',
        budget: 250000,
        status: 'In Corso',
        category: 'Ristrutturazione',
        progress: 35,
        tasks: [
            { id: 1, name: 'Demolizione pareti', completed: true },
            { id: 2, name: 'Rifacimento impianto elettrico', completed: false },
            { id: 3, name: 'Pavimentazione', completed: false }
        ]
    }
];

let projectDocuments = {};
let projectComments = {};
let projectCadFiles = {};

let users = [
    {
        id: 1,
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin123', 10),
        name: 'Admin',
        role: 'professional',
        profession: 'Architetto',
        verified: true
    }
];

// Middleware di autenticazione
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token di autenticazione mancante' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token non valido' });
        }
        req.user = user;
        next();
    });
};

// API di autenticazione
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, profession } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email già registrata' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: users.length + 1,
        email,
        password: hashedPassword,
        name,
        role: 'professional',
        profession,
        verified: false // Richiede verifica admin
    };

    users.push(newUser);
    res.status(201).json({ message: 'Registrazione completata. In attesa di verifica.' });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Credenziali non valide' });
    }

    if (!user.verified) {
        return res.status(403).json({ message: 'Account in attesa di verifica' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            profession: user.profession
        }
    });
});

// Protezione delle API esistenti
app.use('/api/projects', authenticateToken);
app.use('/api/projects/:id/documents', authenticateToken);
app.use('/api/projects/:id/cad', authenticateToken);
app.use('/api/projects/:id/comments', authenticateToken);

// API per i progetti
app.get('/api/projects', (req, res) => {
    res.json(projects);
});

app.post('/api/projects', (req, res) => {
    const newProject = {
        ...req.body,
        id: projects.length + 1,
        tasks: [],
        progress: 0
    };
    projects.push(newProject);
    res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
    const id = parseInt(req.params.id);
    projects = projects.map(project =>
        project.id === id ? { ...project, ...req.body } : project
    );
    res.json(projects.find(p => p.id === id));
});

app.delete('/api/projects/:id', (req, res) => {
    const id = parseInt(req.params.id);
    projects = projects.filter(project => project.id !== id);
    res.json({ message: 'Progetto eliminato' });
});

// API per le attività
app.post('/api/projects/:id/tasks', (req, res) => {
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId);
    if (!project) return res.status(404).json({ message: 'Progetto non trovato' });

    const newTask = {
        id: project.tasks.length + 1,
        name: req.body.name,
        completed: false
    };
    project.tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/api/projects/:projectId/tasks/:taskId', (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const taskId = parseInt(req.params.taskId);
    const project = projects.find(p => p.id === projectId);
    if (!project) return res.status(404).json({ message: 'Progetto non trovato' });

    project.tasks = project.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    project.progress = Math.round(
        (project.tasks.filter(task => task.completed).length / project.tasks.length) * 100
    );
    res.json(project);
});

// API per i documenti
app.post('/api/projects/:id/documents', upload.array('files'), (req, res) => {
    const projectId = parseInt(req.params.id);
    const uploadedFiles = req.files.map(file => ({
        id: Date.now(),
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: file.path,
        uploadDate: new Date().toISOString()
    }));

    projectDocuments[projectId] = [
        ...(projectDocuments[projectId] || []),
        ...uploadedFiles
    ];
    res.status(201).json(uploadedFiles);
});

app.get('/api/projects/:id/documents', (req, res) => {
    const projectId = parseInt(req.params.id);
    res.json(projectDocuments[projectId] || []);
});

app.delete('/api/projects/:projectId/documents/:documentId', (req, res) => {
    const { projectId, documentId } = req.params;
    projectDocuments[projectId] = projectDocuments[projectId].filter(
        doc => doc.id !== parseInt(documentId)
    );
    res.json({ message: 'Documento eliminato' });
});

// API per i file CAD
app.post('/api/projects/:id/cad', upload.array('files'), (req, res) => {
    const projectId = parseInt(req.params.id);
    const uploadedFiles = req.files.map(file => ({
        id: Date.now(),
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: file.path,
        extension: path.extname(file.originalname),
        uploadDate: new Date().toISOString()
    }));

    projectCadFiles[projectId] = [
        ...(projectCadFiles[projectId] || []),
        ...uploadedFiles
    ];
    res.status(201).json(uploadedFiles);
});

app.get('/api/projects/:id/cad', (req, res) => {
    const projectId = parseInt(req.params.id);
    res.json(projectCadFiles[projectId] || []);
});

app.delete('/api/projects/:projectId/cad/:fileId', (req, res) => {
    const { projectId, fileId } = req.params;
    projectCadFiles[projectId] = projectCadFiles[projectId].filter(
        file => file.id !== parseInt(fileId)
    );
    res.json({ message: 'File CAD eliminato' });
});

// API per i commenti
app.post('/api/projects/:id/comments', (req, res) => {
    const projectId = parseInt(req.params.id);
    const newComment = {
        id: Date.now(),
        text: req.body.text,
        author: req.body.author || 'Utente',
        date: new Date().toISOString()
    };

    projectComments[projectId] = [
        ...(projectComments[projectId] || []),
        newComment
    ];
    res.status(201).json(newComment);
});

app.get('/api/projects/:id/comments', (req, res) => {
    const projectId = parseInt(req.params.id);
    res.json(projectComments[projectId] || []);
});

// Cartella per i file caricati
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});