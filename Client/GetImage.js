// main imports 
const net = require("net");
const fs = require("fs");
const open = require("open");
const { argv } = require("process");
const ITPpacket = require("./ITPRequest"); 

// command-line arguments
const HOSTPORT = argv[3]

const HOST = HOSTPORT.slice(0,HOSTPORT.indexOf(':'))
const PORT = HOSTPORT.substring(HOSTPORT.indexOf(':')+1)
const IMAGENAMES = argv[5].split(",")    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHANGE TO SPACE SEPARATED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const VERSION = argv[7]

        console.log(HOST)
        console.log(PORT)
        console.log(IMAGENAMES)
        console.log(VERSION)

// intializing the client
const client = new net.Socket()

ITPpacket.init(VERSION, IMAGENAMES.length, 0, IMAGENAMES)

// client.connect(PORT, HOST, () => {
//     console.log("connected to ImageDB on SERVER: " + HOST + ":" + PORT) 
// })


















// let a = "101"
// let b = parseInt(a,2)
// console.log(b)
