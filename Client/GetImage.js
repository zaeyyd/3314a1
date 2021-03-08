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

//console.log(HOST);
//console.log(PORT);
//console.log(IMAGENAMES);
//console.log(VERSION);

// intializing the client
const client = new net.Socket();

// connecting to server
client.connect(PORT, HOST, () => {
  //console.log("connected to ImageDB on SERVER: " + HOST + ":" + PORT);
  ITPpacket.init(VERSION, IMAGENAMES.length, 0, IMAGENAMES);
  client.write(ITPpacket.getPacket());
});


let data
let first = true
let done = false
let packetLen = 0


// breakup packet and render image
client.on("data", async (dataF) => {

  //console.log(dataF)
  if(first){
    packetLen = dataF.slice(0,4).readUInt32BE()

    //console.log(packetLen)

    data = dataF.slice(4)
    //console.log(data)
    first = false

  }
  else if(!done){
    
    data = Buffer.concat([data, dataF])

    //console.log(data.length)

    if(data.length == packetLen){
      //console.log("dataaa", data)

    let version = data.slice(0,1).readUInt8()
    let fullfilled = data.slice(1,2).readUInt8()
    let resType = data.slice(2,3).readUInt8()
    let imageCount = data.slice(3,4).readUInt8()
    let seqNum = data.slice(4,6).readUInt16BE()
    let timeStamp = data.slice(6,10).readUInt16BE()
  
      console.log("SERVER SENT:")
      console.log("     -- ITP VERSION = ", version)
      console.log("     -- FULFILLED = ", fullfilled)
      console.log("     -- RESPONSE TYPE = ", resType)  
      console.log("     -- IMAGE COUNT = ", imageCount)
      console.log("     -- SEQUENCE NUMBER = ", seqNum)
      console.log("     -- TIMESTAMP = ", timeStamp)




    let payload = data.slice(10)
  
    //console.log("HEADER", version, fullfilled, resType, imageCount, seqNum, timeStamp);
    //console.log("PAYLOAD", payload)
  
  
    let pointer = 0;
    let images = [];
  
    //console.log("image Count", imageCount)
  
    for (i = 0; i < imageCount; i++) {

      let imgType = payload.slice(pointer, pointer + 1);
      imgTypeInt = imgType.readUint8();

      //console.log("TYPE INT", imgTypeInt)
  
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

      //console.log("TYPE ", imgType)
  
      // name size
      let fileNameSize = payload.slice(pointer + 1, pointer + 3);
      fileNameSize = fileNameSize.readUInt16BE();
  
  
      // file size
      let imgFileSize = payload.slice(
        pointer + 3,
        pointer + 5
      );
      imgFileSize = imgFileSize.readUInt16BE();

      //console.log("FILE SIZE", imgFileSize)
  
      let fileName = payload.slice(pointer + 5, pointer + 5 + fileNameSize);
      
      
      fileName = fileName.toString()
      //console.log("FILENAME", fileName)
  
      let image = payload.slice(pointer + 5 + fileNameSize,pointer + 5 + fileNameSize + imgFileSize );
  
        //console.log("SAVINGGG")
        
      let response = await new Promise((resolve) => {
        fs.writeFile(fileName+'.'+imgType, image, function(){ 
          //console.log('Saved!');
          opn('picture.jpg').then(() => {
            resolve()
          })
          .catch(()=> {});
        });
      });
  
    
  
      pointer = pointer + 5 + fileNameSize + imgFileSize
  
  
      //console.log(imgType, fileNameSize, imgFileSize, fileName)
  
      
  
  
  }
    }

  }
  


 

  
  

});
