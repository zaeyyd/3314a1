// timestamp + sequence stuff -- DONE


let timeStamp = 0;
let maxSeq = Math.pow(2, 15);
let seqNum = Math.floor(Math.random() * maxSeq);
let maxTime = Math.pow(2, 32);


module.exports = {
  init: function () {
    let interval = 100;

    setInterval(() => {
      if (timeStamp == maxTime) {
        timeStamp = 0;
      }

      timeStamp = timeStamp + 1;
    }, interval);
  },

  getSequenceNumber: function () {
    if (seqNum < maxSeq) {
      return seqNum++;
    } else {
      seqNum = 0;
      return seqNum;
    }
  },

  getTimestamp: function () {
    return timeStamp;
  },
};
