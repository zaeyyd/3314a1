const { time } = require("console");

let timeStamp = 0
let seqNum = Math.floor(Math.random() * maxSeq) 
let maxTime = Math.pow(2,32)
let maxSeq = Math.pow(2,15)

module.exports = {
    init: function() {
        
    },

 
    getSequenceNumber: function() {
        if(seqNum < maxSeq){
            return seqNum++
        }
        else{
            seqNum = 0
            return seqNum
        }

    },


    getTimestamp: function() {
        return timeStamp
    }


};