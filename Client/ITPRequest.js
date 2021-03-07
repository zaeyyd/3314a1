//header
let version = Buffer.alloc(1); // 3 BIT: this should be = 7
let imageCount = Buffer.alloc(1); // 5 BIT: 1 - 32
let reqType = Buffer.alloc(1); // 8 BIT: 0 = query,
let reserved = Buffer.alloc(2); // not used

//payload
let imgType = Buffer.alloc(1); // 4 bit
let fileNameSize = Buffer.alloc(2); // 12 BIT
let imgFileName

let packet;

module.exports = {
  init: function (v, ic, rt, payload) {
    version.writeUInt8(v);
    imageCount.writeUInt8(ic);
    reqType.writeUInt8(rt);

    let buffArr = [version, imageCount, reqType, reserved]
    let payloadLen = 0 

    console.log(payload)

    for(img of payload){
      let splitName = img.split(".")

      console.log(splitName)
      let name = splitName[0]
      let type = splitName[1]
      let nameLen = img.length

      console.log(name)
      console.log(type)
      console.log(nameLen)


      // processing img file type
      if(type.toLowerCase() == 'bmp'){
        imgType.writeUInt8(1)
      }
      else if(type.toLowerCase() == 'jpeg'){
        imgType.writeUInt8(2)
      }
      else if(type.toLowerCase() == 'gif'){
        imgType.writeUInt8(3)
      }
      else if(type.toLowerCase() == 'png'){
        imgType.writeUInt8(4)
      }
      else if(type.toLowerCase() == 'tiff'){
        imgType.writeUInt8(5)
      }
      else if(type.toLowerCase() == 'raw'){
        imgType.writeUInt8(15)
      }

      console.log(imgType)
      buffArr.push(imgType)

      // processing img file name size
      fileNameSize.writeUInt16BE(nameLen)

      console.log(fileNameSize)
      buffArr.push(fileNameSize)


      imgFileName = Buffer.from(name)

      console.log(imgFileName)
      buffArr.push(imgFileName)
      payloadLen = payloadLen + imgType.length + fileNameSize.length + imgFileName.length 
    }

   

    packet = Buffer.concat(
      buffArr,
      version.length + imageCount.length + reqType.length + reserved.length + payloadLen
    );

    console.log('here')
    console.log(packet)
  },

  getPacket: function () {
    return packet;
  },
};

// int -> buffer
//// buffer.writeUInt8(3)


// int -> buffer
//// buffer.writeUInt8(3)


// int -> buffer
//// buffer.writeUInt8(3)

// int -> buffer
//// buffer.writeUInt8(3)