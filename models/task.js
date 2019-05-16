taskSchema = db.connection.Schema({
    userId:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    startDate:{
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: true
    },
    attachments: String,
    estimatedHours:{
        type: Number,
        required: true
    },
    actualHours:{
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'close']
    },
}, {
    timestamps: true,
}, {strict: "throw"})

module.exports = db.connection.model('Tasks', taskSchema);