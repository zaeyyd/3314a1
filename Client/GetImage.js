// main imports
const net = require("net");
const fs = require("fs");
const opn = require("opn")
const { argv } = require("process");
const ITPpacket = require("./ITPRequest");

// command-line arguments
const HOSTPORT = argv[3];

const HOST = HOSTPORT.slice(0, HOSTPORT.indexOf(":"));
const PORT = HOSTPORT.substring(HOSTPORT.indexOf(":") + 1);
const IMAGENAMES = argv[5].split(","); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHANGE TO SPACE SEPARATED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const VERSION = argv[7];

console.log(HOST);
console.log(PORT);
console.log(IMAGENAMES);
console.log(VERSION);

// intializing the client
const client = new net.Socket();

// connecting to server
client.connect(PORT, HOST, () => {
  console.log("connected to ImageDB on SERVER: " + HOST + ":" + PORT);
  ITPpacket.init(VERSION, IMAGENAMES.length, 0, IMAGENAMES);
  client.write(ITPpacket.getPacket());
});

// breakup packet and render image
client.on("data", (data) => {
  console.log("DATA", data);

  let version = data.slice(0,1).readUInt8()
  let fullfilled = data.slice(1,2).readUInt8()
  let resType = data.slice(2,3).readUInt8()
  let imageCount = data.slice(3,4).readUInt8()
  let seqNum = data.slice(4,6).readUInt16BE()
  let timeStamp = data.slice(6,10).readUInt16BE()


  // version = version
  // fullfilled.readUInt8()
  // resType.readUInt8()
  // imageCount.readUInt8()
  // seqNum.readUInt16BE()
  // timeStamp.readUInt16BE()

  let payload = data.slice(10)

  console.log(version, fullfilled, resType, imageCount, seqNum, timeStamp);
  console.log(payload)


  let pointer = 0;
  let images = [];

  for (i = 0; i < imageCount; i++) {
    let imgType = payload.slice(pointer, pointer + 1);
    imgTypeInt = imgType.readUint8();

    // img type
    if (imgTypeInt == 1) {
      imgType = "bmp";
    } else if (imgTypeInt == 2) {
      imgType = "jpeg";
    } else if (imgTypeInt == 3) {
      imgType = "gif";
    } else if (imgTypeInt == 4) {
      imgType = "png";
    } else if (imgTypeInt == 5) {
      imgType = "tiff";
    } else if (imgTypeInt == 15) {
      imgType = "raw";
    }

    // name size
    let fileNameSize = payload.slice(pointer + 1, pointer + 3);
    fileNameSize = fileNameSize.readUInt16BE();


    // file size
    let imgFileSize = payload.slice(
      pointer + 3,
      pointer + 5
    );
    imgFileSize = imgFileSize.readUInt16BE();

    let fileName = payload.slice(pointer + 5, pointer + 5 + fileNameSize);
    fileName = fileName.toString()

    let image = payload.slice(pointer + 5 + fileNameSize);

    fs.writeFile('picture.jpg', image, function(){ 
      console.log('Saved!');
			opn('picture.jpg').then(() => {
        pointer = pointer + 5 + fileNameSize 
      });
		});


    //console.log(imgType, fileNameSize, imgFileSize, fileName)

    


}

});
