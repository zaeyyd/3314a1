// main imports
let ITPpacket = require("./ITPResponse");
let singleton = require("./Singleton");
let fs = require("fs");

let imageTypeB = Buffer.alloc(1) // 4 BIT: 1 = BMP, 2 = JPEG, 3 = GIF, 4 = PNG, 5 = TIFF, 15 = RAW
let fileNameSizeB = Buffer.alloc(2) // 12 BIT: number of bytes to store image file name
let imageSizeB = Buffer.alloc(2) // 16 BIT:
let ImgFileNameB
let ImgDataB


module.exports = {
  handleClientJoining: function (sock) {
    //console.log("CLIENT IS JOINING");

    sock.on("data", async function (data) {
        
      //console.log("DATA FROM CLIENT ",data);

      // breaking up packet
      let version = data.slice(0, 1);
      let reqType = data.slice(2, 3);
      let imgCount = data.slice(1, 2);
      let payload = data.slice(5);
      let fullfilment = 1

      let seqNum = singleton.getSequenceNumber();
      let timeStamp = singleton.getTimestamp();
      //console.log(version, reqType, imgCount, seqNum, timeStamp);


      // processing payload + header
      imgCount = imgCount.readUint8();
      version = version.readUint8();
      reqType = reqType.readUint8();

      //console.log(version, reqType, imgCount, seqNum, timeStamp);
      //console.log(payload);

      if (version != 7) {
        //console.log("wrong");
      } else if (reqType != 0) {
        //console.log("wrong");
      } else if (imgCount > 32) {
        //console.log("wrong");
      } else {
        // processing each image name

        let pointer = 0;
        let images = [];

        for (i = 0; i < imgCount; i++) {
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

          // file size
          let fileNameSize = payload.slice(pointer + 1, pointer + 3);
          fileNameSize = fileNameSize.readUInt16BE();


          // file name
          let imgFileName = payload.slice(
            pointer + 3,
            pointer + 3 + fileNameSize
          );

          let fullName = imgFileName + "." + imgType;

          //console.log(fullName);

          let imgDB = fs.readdirSync("./images");

          //    FINDING IMAGE IN DB

          if (imgDB.includes(fullName)) {
            //console.log("            we got that");

            let imageData;
            let imageSize;

            let response = await new Promise((resolve) => {
              fs.readFile("./images/" + fullName, (err, image) => {
                if (err) {
                  //console.log("error: " + err);
                }

                imageData = image;
                imageSize = image.length;

                resolve(image);
              });
            });

            //console.log(imageData, imageSize);

            //  ASSEMBLING IMAGE BUFFFERS FOR PAYLOAD 

            //  @@@@@@@@ image type @@@@@@@@@@@@
            imageTypeB.writeUInt8(imgTypeInt)
            let tempIT = Buffer.from(imageTypeB)
            //console.log(tempIT)

            // //  @@@@@@@@ image size @@@@@@@@@@@@
            imageSizeB.writeUInt16BE(imageSize)
            let tempIS = Buffer.from(imageSizeB)
            //console.log(tempIS)

            //  @@@@@@@@ file name size @@@@@@@@@@@@
            fileNameSizeB.writeUInt16BE(fileNameSize)
            let tempFNS = Buffer.from(fileNameSizeB)
            //console.log(tempFNS)

            //  @@@@@@@@ file name  @@@@@@@@@@@@
            //console.log("file name", imgFileName)


            //  @@@@@@@@ imagedata @@@@@@@@@@@@
            //console.log("actual image")


            let imagePayload = Buffer.concat([tempIT, tempFNS, tempIS, imgFileName, imageData])

            //console.log('one of the images', imagePayload)

            images.push(imagePayload)

            // fs.writeFile('picture'+imgTypeInt+'.jpg', imageData, function(err){ //only open file if the packet contains image
            //     if(err) throw err;
                
            // });


          } else {
            //console.log("we dont got that rip ;(");
            fullfilment = 0
          }

          imgFileName = imgFileName.toString();
          pointer = pointer + 3 + fileNameSize;
          //console.log(imgType, fileNameSize, imgFileName);
        }

        //console.log("this should be last");

        
   
        // bundle up in ITP Packet 
        ITPpacket.init(version, fullfilment, fullfilment, imgCount, seqNum, timeStamp, images);
        let packet = ITPpacket.getPacket();
        //console.log(packet.length)
        let lenBuff = Buffer.alloc(4)
        lenBuff.writeUInt32BE(packet.length)
        //console.log(lenBuff)

        sock.write(Buffer.concat([lenBuff, packet]));

      }
    });
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
