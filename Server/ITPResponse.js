//header
let version = Buffer.alloc(1); // 3 BIT: this should be = 7
let fullfilled = Buffer.alloc(1); // 1 BIT: 0 = partially loaded, 1 = fully loaded
let resType = Buffer.alloc(1); // 8 BIT: 0 = query, 1 = found, 2 = not found, 3 = busy
let imageCount = Buffer.alloc(1); // 5 BIT: 0 - 31
let seqNum = Buffer.alloc(2); // 15 BIT: first packet is chosen randomly, then i++, mod2^15 increment
let timeStamp = Buffer.alloc(4); // 32 BIT:


let bufferArr = []

let packet;

module.exports = {
  init: function (v, f, rt, ic, sn, ts, payload) {
    version.writeUInt8(v);

    fullfilled.writeUInt8(f);

    resType.writeUInt8(rt);

    imageCount.writeUInt8(ic);

    seqNum.writeUInt16BE(sn);

    timeStamp.writeUInt32BE(ts);

    //console.log("from ITP res")
    //console.log(version, fullfilled, resType, imageCount, seqNum, timeStamp)

    bufferArr = [version, fullfilled, resType, imageCount, seqNum, timeStamp]

    for(img of payload){
      bufferArr.push(img)
    }







    packet = Buffer.concat(bufferArr);
  },
  getPacket: function () {
    return packet;
  },
};
