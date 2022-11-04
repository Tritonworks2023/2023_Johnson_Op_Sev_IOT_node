const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: { type: String,trim:true  },
    customername: { type: String,trim:true  },
    userid: { type: String,trim:true  },
    ipAddress: { type: String,trim:true  },
    
},{
    collection: 'login_history'
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
      
        // delete ret.password;
    }
});

module.exports = mongoose.model('login_history', schema);