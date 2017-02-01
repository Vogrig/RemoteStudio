define(function (require) {
    // Load any app-specific modules
    var socket;
    require(['matrix'], function(matrix) {

        var ctx = null;
        var canvas = null;
        var matrix;
        
        $(function($) {
            
            socket = io();

            var size = 15;
            var rows = 16;
            var columns = 16;  

            canvas = document.getElementById("canvas");
            ctx = canvas.getContext("2d");

            matrix = new matrix(ctx,rows,columns,size);

            // canvas.addEventListener('click', handleClick);
            canvas.addEventListener('mousedown', handleDown);
            canvas.addEventListener('mouseup', handleUp);
            canvas.addEventListener('mousemove', handleMove);



            //handle on change for all switch control
            $('select.setting').on('change', function() {
                sendSw(this.id,this.value);
            });


            $(".knob").knob({
                change : function (value) {
                    console.log("change : " + this.$.attr('id'));
                    var id = this.$.attr('id');
                    var str = id.slice(1,id.length);
                    socket.emit('message','/v1',parseInt(str), value);
                },
                release : function (value) {
                },
                cancel : function () {
                },
                draw : function () {
                    if(this.$.data('skin') == 'tron') {
                        this.cursorExt = 0.3;
                        var a = this.arc(this.cv)  // Arc
                                , pa                   // Previous arc
                                , r = 1;
                        this.g.lineWidth = this.lineWidth;
                        if (this.o.displayPrevious) {
                            pa = this.arc(this.v);
                            this.g.beginPath();
                            this.g.strokeStyle = this.pColor;
                            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                            this.g.stroke();
                        }
                        this.g.beginPath();
                        this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                        this.g.stroke();
                        this.g.lineWidth = 2;
                        this.g.beginPath();
                        this.g.strokeStyle = this.o.fgColor;
                        this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                        this.g.stroke();
                        return false;
                    }
                }
            });

            var v,
            up=0,
            down=0,
            i=0,
            $idir = $("div.idir"),
            $ival = $("div.ival")
            ,incr = function() { i++; $idir.show().html("+").fadeOut(); $ival.html(i); }
            ,decr = function() { i--; $idir.show().html("-").fadeOut(); $ival.html(i); };
            $("input.infinite").knob({
                  min : 0
                  , max : 20
                  , stopper : false
                  , change : function () {
                  if(v > this.cv){
                      if(up){
                          decr();
                          up=0;
                      }else{up=1;down=0;}
                  } else {
                      if(v < this.cv){
                          if(down){
                              incr();
                              down=0;
                          }else{down=1;up=0;}
                      }
                  }
                  v = this.cv;
                }
            }); 

        });// end load function


    	// socket.on('connect', function(msg) {
    	//   console.log('connecting..:', msg);  
    	// });

        socket.on('connect', function() {
            // sends to socket.io server the host/port of oscServer
            // and oscClient
            console.log("connecting..");
            socket.emit('config',
                {
                    server: {//in osc
                        port: 4999,
                        host: '10.10.10.10'
                    },
                    client: {//out osc
                        port: 10001,
                        host: '10.1.60.68'                  
                    }
                }
            );
        });
        socket.on('count', function(obj) {
            var co = document.getElementById("Nusers");
            co.innerHTML = obj;
        });
        socket.on('update', function(obj) {
            //to check all checkboxs
            //console.log(obj);
            //
            for (var i = 0; i < obj.length; i++){
                if(obj[i] === 1){
                    matrix.positions[i].value = 1;
                }else{
                    matrix.positions[i].value = 0;
                }
            };
            matrix.update();
        });
        socket.on('v1', function(obj) {
            //console.log(obj);
            var aa = document.querySelectorAll(".knob");
            for (var i = 0; i < aa.length; i++){
                //aa[i].setAttribute('value',obj[i]);
                //$(aa[i].id).trigger('change');
                $(aa[i]).val(obj[i]).trigger('change');
            };
            
            // nob.update();
        });
        socket.on('g1', function(obj) {
            //console.log(obj);
            var aa = document.querySelectorAll(".g");
            for (var i = 0; i < aa.length; i++){
                aa[i].setAttribute('value',obj[i]);
                $("#" + aa[i].id ).val(obj[i]).slider("refresh");
            };
        });
        socket.on('sw', function(obj) {
            //console.log(obj);
            for (var i = 0; i < obj.length; i++){
                var el = $('#r'+ i).val(obj[i]).selectmenu('refresh');
             
                // Select the relevant option, de-select any others
                //el.val(obj[i]).attr('selected',true).siblings('option').removeAttr('selected'); 
                
                
                // jQM refresh not working on safari
               // el.trigger('change');
                //crea problemi in google chrome
                //aa[i].selectmenu("refresh", true);
            };
        });

        function sendG(id,val) {
            var str = id.slice(1,id.length);
            //console.log(id + "," + val);
            socket.emit('message','/g1',parseInt(str),val);
        };

        function sendSw(id,value) {
            //console.log(id + "," + value);
            var str = id.slice(1,id.length);
            //console.log(str);
            socket.emit('message','/sw',parseInt(str),value);
        };


        //handle user event
        function handleDown(e) {
            matrix.mousedown = true;
            matrix.find(e.offsetX,e.offsetY,socket);
        }
        function handleClick(e) {
            matrix.oldPos = -1;
            matrix.find(e.offsetX,e.offsetY,socket);
        }
        function handleUp(e) {
            matrix.mousedown = false;
            matrix.oldPos = -1;
        }
        function handleMove(e) {
            if(matrix.mousedown){
                matrix.find(e.offsetX,e.offsetY,socket);
            }
        }

    });// end of require
    
});