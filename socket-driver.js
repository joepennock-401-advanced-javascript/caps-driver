'use strict';

/*
- Connect to caps hub socket
  - connect to hubs namespace
    - Listen for 'pickup' event
      - wait 1 second
        - log 'order picked up'
        - emit 'in-transit' to hub
      - wait 3 seconds
        - log 'delivered' to hub
        - emit 'delivered' to hub
*/

// global
require('dotenv').config();
const socket = require('socket.io-client');
let host = process.env.HOST;
const capsNamespace = socket.connect(`${host}/caps-namespace`);

capsNamespace.on('pickup', (payload) => {
  setTimeout( () => {
    inTransit(payload);
  }, 1000);
  setTimeout( () => {
    delivered(payload);
  }, 3000)
});

function inTransit(payload){
  console.log(`DRIVER: picked up order # ${payload.orderID}`);
  capsNamespace.emit('in-transit', payload);
};

function delivered(payload){
  console.log(`DRIVER: Order # ${payload.orderID} has been delivered`);
  capsNamespace.emit('delivered', payload);
};

