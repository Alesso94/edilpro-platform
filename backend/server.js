require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const mongoose = require('mongoose');

// Import Models
const User = require('./models/User');
const Project = require('./models/Project');
const Document = require('./models/Document');
const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/users');
const documentRoutes = require('./routes/documents');
const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects');
const documentsRoutes = require('./routes/documents');
const professionalsRoutes = require('./routes/professionals');
const settingsRoutes = require('./routes/settings');

const app = express();
const port = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

// Connessione a MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        console.log('Database:', mongoose.connection.db.databaseName);
        console.log('Host:', mongoose.connection.host);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Gestione degli errori di connessione
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Crea le cartelle necessarie se non esistono
const uploadDir = path.join(__dirname, 'uploads');
const documentsDir = path.join(uploadDir, 'documents');
const cadDir = path.join(uploadDir, 'cad');

[uploadDir, documentsDir, cadDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Configurazione CORS
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:10000', 
    'https://edilpro-platform.onrender.com',
    'https://edilpro-platform.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// API di autenticazione
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, profession, license } = req.body;
        
        // Verifica se l'utente esiste già
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già registrata' });
        }

        // Crea nuovo utente
        const user = new User({
            email,
            password,
            name,
            profession,
            license,
            role: 'professional'
        });

        // Genera token di verifica
        const verificationToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        res.status(201).json({ 
            message: 'Registrazione completata. Controlla la tua email per la verifica.',
            verificationToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante la registrazione', error: error.message });
    }
});

app.post('/api/auth/verify', async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({
            _id: decoded.userId,
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token non valido o scaduto' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.json({ message: 'Email verificata con successo' });
    } catch (error) {
        res.status(400).json({ message: 'Errore durante la verifica', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Account non verificato. Verifica la tua email.' });
        }

        const token = await user.generateAuthToken();
        res.json({
            user: user.toJSON(),
            token
        });
    } catch (error) {
        res.status(401).json({ message: 'Credenziali non valide' });
    }
});

// Middleware di autenticazione
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token di autenticazione mancante' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token non valido' });
    }
};

// Protezione delle API esistenti
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/projects/:id/documents', authenticateToken);
app.use('/api/projects/:id/cad', authenticateToken);
app.use('/api/projects/:id/comments', authenticateToken);

// Rotte
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/settings', settingsRoutes);

// Endpoint di test per verificare che il server sia raggiungibile
app.get('/api', (req, res) => {
  res.json({ message: 'API server is running' });
});

// API per i documenti
app.post('/api/projects/:id/documents', authenticateToken, upload.array('files'), async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Progetto non trovato' });
        }

        const uploadedFiles = await Promise.all(req.files.map(async file => {
            const document = new Document({
                name: file.filename,
                type: 'document',
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype,
                project: project._id,
                uploadedBy: req.user._id
            });
            await document.save();
            return document;
        }));

        res.status(201).json(uploadedFiles);
    } catch (error) {
        res.status(400).json({ message: 'Errore nel caricamento dei documenti', error: error.message });
    }
});

app.get('/api/projects/:id/documents', authenticateToken, async (req, res) => {
    try {
        const documents = await Document.find({
            project: req.params.id,
            type: 'document'
        }).populate('uploadedBy', 'name email');
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dei documenti', error: error.message });
    }
});

app.delete('/api/projects/:projectId/documents/:documentId', authenticateToken, async (req, res) => {
    try {
        const document = await Document.findOneAndDelete({
            _id: req.params.documentId,
            project: req.params.projectId,
            uploadedBy: req.user._id
        });

        if (!document) {
            return res.status(404).json({ message: 'Documento non trovato' });
        }

        // Elimina il file fisico
        fs.unlink(document.path, (err) => {
            if (err) console.error('Errore nell\'eliminazione del file:', err);
        });

        res.json({ message: 'Documento eliminato' });
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'eliminazione del documento', error: error.message });
    }
});

// API per i file CAD
app.post('/api/projects/:id/cad', authenticateToken, upload.array('files'), async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Progetto non trovato' });
        }

        const uploadedFiles = await Promise.all(req.files.map(async file => {
            const document = new Document({
                name: file.filename,
                type: 'cad',
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimeType: file.mimetype,
                project: project._id,
                uploadedBy: req.user._id
            });
            await document.save();
            return document;
        }));

        res.status(201).json(uploadedFiles);
    } catch (error) {
        res.status(400).json({ message: 'Errore nel caricamento dei file CAD', error: error.message });
    }
});

app.get('/api/projects/:id/cad', authenticateToken, async (req, res) => {
    try {
        const documents = await Document.find({
            project: req.params.id,
            type: 'cad'
        }).populate('uploadedBy', 'name email');
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dei file CAD', error: error.message });
    }
});

app.delete('/api/projects/:projectId/cad/:fileId', authenticateToken, async (req, res) => {
    try {
        const document = await Document.findOneAndDelete({
            _id: req.params.fileId,
            project: req.params.projectId,
            type: 'cad',
            uploadedBy: req.user._id
        });

        if (!document) {
            return res.status(404).json({ message: 'File CAD non trovato' });
        }

        // Elimina il file fisico
        fs.unlink(document.path, (err) => {
            if (err) console.error('Errore nell\'eliminazione del file:', err);
        });

        res.json({ message: 'File CAD eliminato' });
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'eliminazione del file CAD', error: error.message });
    }
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

// Gestione errori non catturati
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

// Avvio del server
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

// Gestione chiusura graziosa
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Performing graceful shutdown...');
    server.close(() => {
        console.log('Server closed. Exiting process.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Performing graceful shutdown...');
    server.close(() => {
        console.log('Server closed. Exiting process.');
        process.exit(0);
    });
});