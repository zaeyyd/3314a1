// main imports
let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');
let fs = require('fs')


module.exports = {

    handleClientJoining: function (sock) {


        console.log("CLIENT IS JOINING")
        
        sock.on('data', function(data){

            console.log(data)

            //   v, f (later), rt, ic, sn, ts,

            // breaking up packet
            let version = data.slice(0, 1)
            let reqType = data.slice(2, 3)
            let imgCount = data.slice(1, 2)
            let payload = data.slice(5)

            let seqNum = singleton.getSequenceNumber()
            let timeStamp = singleton.getTimestamp()
            console.log(version, reqType, imgCount, seqNum, timeStamp)
            console.log(payload)

            // processing payload + header
            imgCount = imgCount.readUint8()
            version = version.readUint8()
            reqType = reqType.readUint8()

            console.log(version, reqType, imgCount, seqNum, timeStamp)
            console.log(payload)
            
            // processing each image

            let pointer = 0
            for (i = 0; i < imgCount; i++) {
                
                let imgType = payload.slice(pointer,pointer + 1)


                let fileNameSize = payload.slice(pointer + 1,pointer + 3)
                
                fileNameSize = fileNameSize.readUInt16BE()
                console.log(fileNameSize)


                let imgFileName = payload.slice(pointer + 3, pointer + 3 + fileNameSize )
                pointer = pointer + 3 + fileNameSize


                console.log(pointer)
                console.log(imgType, fileNameSize, imgFileName)
              }
        })
        
  
    }
};


// int -> buffer
//// buffer.writeUInt8(3)

// buffer -> int
//// buffer.readUInt8()

// string -> buffer
//// Buffer.from('string')

// buffer -> string
//// imgFileName.toString()