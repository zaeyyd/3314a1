//header
let version = Buffer.alloc(1); // 3 BIT: this should be = 7
let imageCount = Buffer.alloc(1); // 5 BIT: 1 - 32
let reqType = Buffer.alloc(1); // 8 BIT: 0 = query,
let reserved = Buffer.alloc(2); // not used

//payload
let imgType = Buffer.alloc(1); // 4 bit
let fileNameSize = Buffer.alloc(2); // 12 BIT
let imgFileName;

let packet;

module.exports = {
  init: function (v, ic, rt, payload) {

    // adding header data
    version.writeUInt8(v);
    imageCount.writeUInt8(ic);
    reqType.writeUInt8(rt);

    let buffArr = [version, imageCount, reqType, reserved];
    let payloadLen = 0;


    // processing data for each img
    for (img of payload) {

      // breaking up name string into relavent parts
      let splitName = img.split(".");

      //console.log(splitName);
      let name = splitName[0];
      let type = splitName[1];
      let nameLen = name.length;

      //console.log(name);
      //console.log(type);
      //console.log(nameLen);


      // 1) processing img file type

      let tempIT
      if (type.toLowerCase() == "bmp") {
        imgType.writeUInt8(1)
        tempIT = Buffer.from(imgType)
      } else if (type.toLowerCase() == "jpeg") {
        imgType.writeUInt8(2)
        tempIT = Buffer.from(imgType)
      } else if (type.toLowerCase() == "gif") {
        imgType.writeUInt8(3)
        tempIT = Buffer.from(imgType)
      } else if (type.toLowerCase() == "png") {
        imgType.writeUInt8(4)
        tempIT = Buffer.from(imgType)
      } else if (type.toLowerCase() == "tiff") {
        imgType.writeUInt8(5)
        tempIT = Buffer.from(imgType)
      } else if (type.toLowerCase() == "raw") {
        imgType.writeUInt8(15)
        tempIT = Buffer.from(imgType)
      }

      //console.log(tempIT);
      buffArr.push(tempIT);

      // 2) processing img file name size
      fileNameSize.writeUInt16BE(nameLen);
      let tempFNS = Buffer.from(fileNameSize)
      //console.log(tempFNS)
      buffArr.push(tempFNS);

      //console.log(buffArr)

      // 3) processing img file name
      imgFileName = Buffer.from(name);
      //console.log(imgFileName);
      buffArr.push(imgFileName);

      // 4) calculating total size of buffer for this image name
      payloadLen =
        payloadLen + imgType.length + fileNameSize.length + imgFileName.length;
    }

    /// putting all buffer data together in packet
    packet = Buffer.concat(
      buffArr,
      version.length +
        imageCount.length +
        reqType.length +
        reserved.length +
        payloadLen
    );


    //console.log(packet);
  },

  getPacket: function () {
    return packet;
  },
};

// int -> buffer
//// buffer.writeUInt8(3)

// buffer -> int
//// buffer.readUInt8()

// string -> buffer
//// Buffer.from('string')

// buffer -> string
//// imgFileName.toString()
