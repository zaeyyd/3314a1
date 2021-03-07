//header
let version = Buffer.alloc(1) // 3 BIT: this should be = 7
let fullfilled = Buffer.alloc(1) // 1 BIT: 0 = partially loaded, 1 = fully loaded
let resType = Buffer.alloc(1) // 8 BIT: 0 = query, 1 = found, 2 = not found, 3 = busy
let imageCount = Buffer.alloc(1) // 5 BIT: 0 - 31
let seqNum = Buffer.alloc(2) // 15 BIT: first packet is chosen randomly, then i++, mod2^15 increment
let timeStamp = Buffer.alloc(4) // 32 BIT:



//payload
// let imageType = Buffer.alloc(1) // 4 BIT: 1 = BMP, 2 = JPEG, 3 = GIF, 4 = PNG, 5 = TIFF, 15 = RAW
// let fileNameSize = Buffer.alloc(2) // 12 BIT: number of bytes to store image file name
// let imageName = Buffer.alloc(4) // 32 BIT: stores the name of the image without extension
// let imageSize = Buffer.alloc(2) // 16 BIT:
let imageData;

let packet

module.exports = {
  init: function (v, f, rt, ic, sn, ts, payload) {

    version.writeUInt8(v)

    fullfilled.writeUInt8(f)

    resType.writeUInt8(rt)

    imageCount.writeUInt8(ic)

    seqNum.writeUInt16BE(sn)

    timeStamp.writeUInt32BE(ts)

    imageData = payload

   
    packet = Buffer.concat([
      version,

      fullfilled,

      resType,

      imageCount,

      seqNum,

      timeStamp,

      imageData

    ], version.length+fullfilled.length+resType.length+imageCount.length+seqNum.length+timeStamp.length+imageData.length);
  },
  getPacket: function() {return packet;}
 
  
};


