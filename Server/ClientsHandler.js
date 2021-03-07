let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');
let fs = require('fs')
let imageSize
let imageData

// You may need to add some delectation here


module.exports = {

    handleClientJoining: function (sock) {

        console.log("handle client joining")
        
        sock.on('data', function(data){
            // increment sequnce number
            // make timestamp
            
        })
        
  
    }
};


    
        // you may need to develop some helper functions
        // that are defined outside this export block