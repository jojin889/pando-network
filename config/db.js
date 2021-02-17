const mongoose = require('mongoose');
// connection classique à mongoDB
mongoose
    .connect('mongodb+srv://'+ process.env.DB_USER_PASS + '@cluster0.1cbmf.mongodb.net/pando?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false    
    }
    )
    .then(() => console.log('SUCCESS mongoDB connect'))
    .catch((err) => console.log('Failed connection to mongoDB...', err))