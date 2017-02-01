define('core',function(){

	function core(){
		this.users = [];
		this.oscServer;
		this.oscClient;
		this.ma = [256];//matrix
		this.v1 = [18];//v-fug
		this.g1 = [18];//mixer volume
		this.sw = [18];//switch
		this.started = 0;
		this.initArray();
	}//core.constructor

	core.prototype.addUser = function(id){
		this.users.push(id);
	};

	core.prototype.removeUser = function(id){
		var idremove = this.users.indexOf(id);
    	this.users.splice(idremove, 1);
	};

	core.prototype.getUsers = function(){
		return this.users;
	};
	core.prototype.initArray = function(){
	  if(this.started === 0)
	  {
	    for (var i=0;i<255;i++) {
	      this.ma[i] = 0;
	    };
	    for (var i = 0; i < 16; i++) {
	      this.sw[i] = 0;
	      this.v1[i] = 0;
	      this.g1[i] = 0;
	    };
	    this.started = 1;
	  };
	}


	//shift 16 bit
	//input: [4095,4095]
	//[a,b]
	//(a << 16) + b
	//result: [268374015]
	core.prototype.shiftArray16 = function(arg){
	    var index = 0;
	    var res = [arg.length/2];
	    for (var i=0; i < arg.length; i=i+2) {
	      if(i<=arg.length -2)
	      { 
	        res[index] = this.shift16(arg[i],arg[i+1]);
	        index++;
	      };
	    }
	    return res;
	}
	//shift 2 bit
	//input: [1,1]
	//[a,b]
	//(a << 2) + b
	//result: [5]
	core.prototype.shiftArray2 = function(arg){
	    var index = 0;
	    var res = [arg.length/2];
	    for (var i=0; i < arg.length; i=i+2) {
	      if(i<=arg.length -2)
	      { 
	        res[index] = this.shift2(arg[i],arg[i+1]);
	        index++;
	      };
	    }
	    return res;
	}

	core.prototype.Bin2Dec = function(bin)
	{
	  return parseInt(bin, 2);
	}
	core.prototype.Dec2Bin = function(dec){
	  return dec.toString(2);
	}
	core.prototype.collectLed = function(){
	  var out = [8];
	  var arr = this.mapMatrix();
	  for (var i = 0; i < arr.length; i += 4) {
	      out[i/4] = this.shift24(arr[i],arr[i+1],arr[i+2],arr[i+3]);
	  };
	  out.unshift(0);
	  out.pop();
	  return out;
	}
	core.prototype.mapMatrix = function(){
	  var arr = [32];
	  for (var i = 0; i < this.ma.length; i += 8) {
	    arr[i/8] = this.getLedValue(this.ma.slice(i,i+8));
	  };
	  return arr;
	}
	core.prototype.getLedValue = function(params){
	  var temp = params.join();//.reverse()
	  temp = temp.split(",").join("");
	  return this.Bin2Dec(temp);
	}

	//ma
	core.prototype.shift24 = function(x,y,z,k){
	    return (x << 24) + (y << 16) + (z << 8) + k;
	}
	//v1,g1
	core.prototype.shift16 = function(x,y){
	    return (x << 16) + y;
	}
	//r1,r2,r3,r4,r5,r6,r7,r8
	core.prototype.shift2 = function(x,y){
	    return (x << 2) + y;
	}
	//v1 0-100 * 40.95 = 0 - 4095
	core.prototype.scalarMultiply = function(arr, multiplier) {
	  var res = [arr.length];
	   for (var i = 0; i < arr.length; i++)
	   {
	      res[i] = Math.round(arr[i] * multiplier);
	   }
	   return res;
	}
	//g1 4095 - (0-4095) = 4095 - 0
	core.prototype.scalarSubtraction = function(arr, sub) {
	  var res = [arr.length];
	   for (var i = 0; i < arr.length; i++)
	   {
	      res[i] = sub - arr[i];
	   }
	   return res;
	}



	return core;
});
