const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    status: { 
        type: String, 
        enum: ['Non Iniziato', 'In Corso', 'Completato'],
        default: 'Non Iniziato'
    },
    priority: {
        type: String,
        enum: ['Bassa', 'Media', 'Alta'],
        default: 'Media'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Non Iniziato', 'In Corso', 'Completato', 'In Pausa'],
        default: 'Non Iniziato'
    },
    category: {
        type: String,
        required: true,
        enum: ['Ristrutturazione', 'Nuova Costruzione', 'Restauro', 'Progettazione', 'Altro']
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [taskSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema); 