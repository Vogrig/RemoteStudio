define('matrix',function(){

	function POINT(x,y,value){
	    this.x = x;
	    this.y = y;
	    this.value = value;
  	}


	function matrix(ctx,rows,columns,size){
		this.ctx = ctx;
    	this.size = size;
    	this.rows = rows;
    	this.columns = columns;
    	this.positions = [];
    	this.mousedown = false;
    	this.oldPos = 0;
    	this.draw();
	}//core.constructor

	matrix.prototype.draw =  function (){

	    this.ctx.beginPath();
	    this.ctx.lineWidth = 0.1;
	    this.ctx.strokeStyle = 'black';
	    this.ctx.fillStyle = "#afafaf";//'grey';//"#72746e";
	    for (var row = 0; row < this.rows; row++) {
	      for (var column = 0; column < this.columns; column++) {
	        var x = column * this.size;
	        var y = row * this.size;
	        var p = new POINT(x,y,0);
	        this.positions.push(p);
	        this.ctx.beginPath();
	        if(this.squared){
	          this.ctx.rect(x, y, this.size, this.size);
	          this.ctx.stroke();
	          this.ctx.fill();
	        }else{
	          this.ctx.arc(x+this.size/2,y+this.size/2, this.size/2.5, 0, 2 * Math.PI, false);
	          this.ctx.fill();
	        }
	        
	      }
	    }
	    this.ctx.closePath();
  	}

  	matrix.prototype.update =  function (){
        for (var i = 0;i<this.positions.length;i++) {
            var x = this.positions[i].x;
            var y = this.positions[i].y;
            this.ctx.beginPath();
           if(this.positions[i].value  > 0){
              this.ctx.fillStyle = "#47a540";//"#ffbd31"; 
              this.ctx.arc(Math.floor(x/this.size)*this.size+this.size/2, Math.floor(y/this.size)*this.size+this.size/2, this.size/2.7, 0, 2 * Math.PI, false);
              this.ctx.fill();
            }else{
              this.ctx.fillStyle = "#afafaf";//'grey';//"#72746e"; 
              this.ctx.arc(x+this.size/2, y+this.size/2, this.size/2.5, 0, 2 * Math.PI, false);;
              this.ctx.fill()
            }
            this.ctx.closePath();
        };
  	}

  	matrix.prototype.pointRectangleIntersection = function(p, r) {
      return p.x > r.x1 && p.x < r.x2 && p.y > r.y1 && p.y < r.y2;
  	}

  	matrix.prototype.find = function(xx,yy,socket){  
	    var pos = 0;
	    for (var row = 0; row < this.rows; row++) {
	      for (var column = 0; column < this.columns; column++) {
	        var x = this.positions[pos].x;
	        var y = this.positions[pos].y;
	        var rectangle = {
	          x1: x,       y1: y, 
	          x2: x+this.size,  y2: y+this.size
	        };
	        var point = {
	          x: xx,
	          y: yy
	        };

	        if(this.pointRectangleIntersection(point,rectangle)){
	          if(this.oldPos !== pos){
	            this.ctx.beginPath();
	            this.ctx.fillStyle = "white";
	            this.ctx.lineWidth = 0.1;
	//            this.ctx.strokeStyle = 'white';
	            this.positions[pos].value = this.positions[pos].value === 0 ? 1 : 0;
	            if(this.positions[pos].value  > 0){
	              this.ctx.fillStyle = "#47a540";//"#ffbd31"; 
	              
	              this.ctx.arc(Math.floor(x/this.size)*this.size+this.size/2, Math.floor(y/this.size)*this.size+this.size/2, this.size/2.7, 0, 2 * Math.PI, false);
	              socket.emit('message','/ma',parseInt(pos), 1);
	              
	              this.ctx.fill();
	            }else{
	              this.ctx.fillStyle = "#afafaf";//'grey';//"#72746e"; 
	              this.ctx.arc(x+this.size/2, y+this.size/2, this.size/2.5, 0, 2 * Math.PI, false);;
	              socket.emit('message','/ma',parseInt(pos), 0);
	              this.ctx.fill()
	              //this.ctx.stroke();
	            }
	            this.ctx.closePath();
	            this.oldPos = pos;
	          }
	        }
	        pos++;
	      }
	    }
	  }



	return matrix;
});