module.exports = {
    app:{
        port: 3000,
        protocal: 'http',
        host: 'localhost',
    },
    db:{
        host: '127.0.0.1',
        name: 'taskmanager',
        port: 27017
    },
    email:{
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'thamaraiselvamprivate@gmail.com',
            pass: 'selva@123'
        }
    }
}