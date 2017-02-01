define(['socket.io','./app','./core','node-osc'], function(socketio,app,core,osc) {

  var io = socketio.listen(app);
  core = new core();

  core.oscClient = new osc.Client('10.1.60.68', 10001);

  io.sockets.on('connection', function(socket) {
    
    //socket.join('*');

    core.addUser(socket.id);
    console.log('websocket connect: %s',socket.id);
    
    //io.sockets.emit('msg','hello!');

    // core.oscServer = new osc.Server(, obj.server.host);

    socket.on('config',function(obj){
      //sockets to update Client GUI
      io.sockets.emit("count",core.users.length);
      io.sockets.emit("update", core.ma);
      io.sockets.emit("v1", core.v1);
      io.sockets.emit("g1", core.g1);
      io.sockets.emit("sw", core.sw);
      //init OscServer,OscClient
      
      console.log("host: " + core.oscClient.host + " Port: " + core.oscClient.port);
      //osc OUT
      core.oscClient.send('/status', socket.id + ' connected');
      //osc IN
      // core.oscServer.on('message', function(msg, rinfo) {
      //     console.log(msg, rinfo);
      //     socket.emit("message", msg);
      // });
      // console.log('config',obj);
    });

    socket.on("message", function (address,arg1,arg2) {
      //oscClient.send("/r1",0,0);
      var id = parseInt(arg1);
      var value = parseInt(arg2);
      if(address == "/v1")//v-fug frequenccy
      {
        if(core.v1.length === 16)
        { 
          core.v1[id]=value;
          io.sockets.emit("v1", core.v1);
          var a = core.scalarMultiply(core.v1, 40.95);
          var shift = core.shiftArray16(a);
          core.oscClient.send(address,shift);
        };
      }
      else if(address == "/sw")//v-fug switch
      {
        if(core.sw.length == 16)
        {
          core.sw[id]=value;
          io.sockets.emit("/sw", core.sw);
          var shift = core.shiftArray2(core.sw); 
          switch(id)
          {
            case 0: 
            case 1: 
            core.oscClient.send("/r1",shift[0]);
            break;
            case 2: 
            case 3: 
            core.oscClient.send("/r2",shift[1]);
            break;
            case 4: 
            case 5: 
            core.oscClient.send("/r3",shift[2]);
            break;
            case 6: 
            case 7: 
            core.oscClient.send("/r4",shift[3]);
            break;
            case 8: 
            case 9: 
            core.oscClient.send("/r5",shift[4]);
            break;
            case 10: 
            case 11: 
            core.oscClient.send("/r6",shift[5]);
            break;
            case 12: 
            case 13: 
            core.oscClient.send("/r7",shift[6]);
            break;
            case 14: 
            case 15: 
            core.oscClient.send("/r8",shift[7]);
            break;
          }
        };
      }
      else if(address == "/ma")//matrix routing
      {
        core.ma[id]=value;
        io.sockets.emit("update", core.ma);
        core.oscClient.send(address,core.collectLed());
      };
      if(address == "/g1")//mixer volume
      {
        if(core.g1.length === 16)
        {
          core.g1[id]=value;
          io.sockets.emit("g1", core.g1);
          var a = core.scalarSubtraction(core.g1,4095);
          var shift = core.shiftArray16(a); 
          core.oscClient.send(address,shift);
        };
      };
    });


  	socket.on('disconnect',function(){
  		core.removeUser(socket.id);
		console.log("websocket disconnect : %s",socket.id);
	});



  });


  return io;
});
