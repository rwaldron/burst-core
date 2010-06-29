/*
    Burst Engine 0.3.53 - http://hyper-metrix.com/#burst        
    Copyright (c) 2009 Alistair MacDonald        
    
    MIT License
    
    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:
    
    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
*/

burst.prototype.defaults={
   // Default easing method
   ease:"easeInOutQuad",
   // Milliseconds per frame | 20mspf equates to approx. 60fps
   mspf:20,
   // Set Debug Mode on/off
   debug:false
}  

//////// M A S T E R - C O N T R O L E R ///////////////////////////////////////
function burst(name,width,height,canvas){    
  this.version = "Burst.js.0.3.30"  
  this.name=name;
  this.urlIndex=[];
  this.ajaxMem=[];
  this.timelines=[];
  this.clickIndex=[];
  this.buffer=[];
  //this.tl=""; // is this used anymore???
  this.mspf = this.defaults.mspf;
  this.frame = 0;
  this.width=width;
  this.height=height;
  this.paused=false;
  this.canvas=canvas;
  this.alwaysFunction=function(){};
  this.mouseX=0;
  this.mouseY=0;
  this.bind(this.canvas,this);     
  }  
        
  burst.prototype.name;
  burst.prototype.version;
  burst.prototype.urlIndex;
  burst.prototype.ajaxMem;
  burst.prototype.timelines;
  burst.prototype.buffer;
  burst.prototype.tl;
  burst.prototype.mspf;
  burst.prototype.frame;
  burst.prototype.width;
  burst.prototype.height;
  burst.prototype.mouseX;
  burst.prototype.mouseY;
  burst.prototype.alwaysFunction; 
 
  burst.prototype.debug=function(){if(burst.prototype.defaults.debug==true){  
    switch(arguments[0]){
    case "bounds":            
      var t=arguments[1];
      ctx.lineWidth=2;
      ctx.strokeStyle="#ff00ff";
      ctx.beginPath();
        ctx.moveTo(t.centerX-30+t.left,t.centerY-30+t.top);
        ctx.lineTo(t.centerX+30+t.left,t.centerY+30+t.top);
        ctx.moveTo(t.centerX+30+t.left,t.centerY-30+t.top);
        ctx.lineTo(t.centerX-30+t.left,t.centerY+30+t.top);
      ctx.closePath();
      ctx.stroke();
      break;
    default:
      console.log(arguments);    
    }
  }}

  // Sets new always-function
  burst.prototype.always=function(aFunc){
    this.alwaysFunction=aFunc;
  }
  
  burst.prototype.bind=function(curElement,inst){// Adapted from Processing.js by John Resig | http://ejohn.org
    function attach(elem,type,fn){
      if(elem.addEventListener)
        elem.addEventListener(type,fn,false);
      else
        elem.attachEvent("on"+type,fn);
    }
    attach(curElement,"mousemove",function(e){
      var scrollX=window.scrollX!=null?window.scrollX:window.pageXOffset;
      var scrollY=window.scrollY!=null?window.scrollY:window.pageYOffset;
      inst.mouseX=(e.clientX-curElement.offsetLeft+scrollX);
      inst.mouseY=(e.clientY-curElement.offsetTop+scrollY);
    });
  }
 
  burst.prototype.has = function(needle,hay){
    if(hay.indexOf(needle,0)>-1){
      return true;
    } else {
      return false;
    };
  };
  
  burst.prototype.hexRGBA = function(hex){  
    var RGBA = toNumbers(hex);
    function toNumbers(str){
      var ret=[];
      str.replace(/(..)/g,function(str){
        ret.push(parseInt(str,16));
      });      
      return ret;
    }
    return RGBA;
  }
    
  burst.prototype.toHex = function toHex(decimal){
    var hexTable = "0123456789ABCDEF";
    if(decimal<0){
      return "00";
    } else if(decimal>255){
      return "ff";
    }
    var c1=Math.floor(decimal/16);
    var c2=decimal%16;
    return hexTable.charAt(c1)+hexTable.charAt(c2);
  }
    
  burst.prototype.radians=function(aAngle){
    return (aAngle/180)*Math.PI;
  };
  
  burst.prototype.degrees=function(aAngle){
    aAngle=(aAngle*180)/Math.PI;  
    if(aAngle<0){aAngle=360+aAngle}
    return aAngle;
  };
    
  burst.prototype.ease = function(e,x,t,b,c,d){
    //debug(arguments);
    switch(e){
      case "step":if(t==d){return d;}else{return 1;};break;
      case "linear": return c*t/d + b; break;
      case "easeInQuad": return c*(t/=d)*t + b; break;
      case "easeOutQuad": return -c *(t/=d)*(t-2) + b; break;
      case "easeInOutQuad": if ((t/=d/2) < 1) return c/2*t*t + b; return -c/2 * ((--t)*(t-2) - 1) + b; break;
      case "easeInCubic": return c*(t/=d)*t*t + b; break;
      case "easeOutCubic": return c*((t=t/d-1)*t*t + 1) + b; break;
      case "easeInOutCubic": if ((t/=d/2) < 1) return c/2*t*t*t + b; return c/2*((t-=2)*t*t + 2) + b; break;
      case "easeInQuart": return c*(t/=d)*t*t*t + b; break;
      case "easeOutQuart": return -c * ((t=t/d-1)*t*t*t - 1) + b; break;
      case "easeInOutQuart": if ((t/=d/2) < 1) return c/2*t*t*t*t + b; return -c/2 * ((t-=2)*t*t*t - 2) + b; break;
      case "easeInQuint": return c*(t/=d)*t*t*t*t + b; break;
      case "easeOutQuint": return c*((t=t/d-1)*t*t*t*t + 1) + b; break;
      case "easeInOutQuint": if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b; return c/2*((t-=2)*t*t*t*t + 2) + b; break;
      case "easeInSine": return -c * Math.cos(t/d * (Math.PI/2)) + c + b; break;
      case "easeOutSine": return c * Math.sin(t/d * (Math.PI/2)) + b; break;
      case "easeInOutSine":  return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b; break;
      case "easeInExpo": return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b; break;
      case "easeOutExpo": return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; break;
      case "easeInOutExpo": if (t==0) return b; if (t==d) return b+c; if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b; return c/2 * (-Math.pow(2, -10 * --t) + 2) + b; break;
      case "easeInCirc": return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b; break;
      case "easeOutCirc": return c * Math.sqrt(1 - (t=t/d-1)*t) + b; break;
      case "easeInOutCirc": if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b; return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b; break;
      case "easeInElastic": var s=1.70158;var p=0;var a=c; if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3; if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; break;
      case "easeOutElastic": var s=1.70158;var p=0;var a=c; if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3; if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b; break;
      case "easeInOutElastic": var s=1.70158;var p=0;var a=c; if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5); if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b; break;
      case "easeInBack": if (s == undefined) s = 1.70158; return c*(t/=d)*t*((s+1)*t - s) + b; break;
      case "easeOutBack": if (s == undefined) s = 1.70158; return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b; break;
      case "easeInOutBack": if (s == undefined) s = 1.70158;  if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b; return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b; break;
      case "easeInBounce": return c - ease("easeOutBounce", x, d-t, 0, c, d) + b; break;
      case "easeOutBounce": if ((t/=d) < (1/2.75)) { return c*(7.5625*t*t) + b; } else if (t < (2/2.75)) { return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b; } else if (t < (2.5/2.75)) { return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b; } else { return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b; } break;
      case "easeInOutBounce": if (t < d/2) return ease("easeInBounce",x, t*2, 0, c, d) * .5 + b; return ease("easeOutBounce",x, t*2-d, 0, c, d) * .5 + c*.5 + b; break;
    }
  }
  
  burst.prototype.engine = function(object,frame,curProp,curKey,nextKey){      
      var ease=this.ease;
      if(frame>=curKey.frame&&frame<nextKey.frame){
        var e=curKey.easing;
        var x=0;
        var t=frame-curKey.frame;
        var b=curKey.value;        
        var c=nextKey.value-curKey.value;
        var d=nextKey.frame-curKey.frame;
        switch(curProp){
          case "left":object.left=ease(e,x,t,b,c,d);break;
          case "top":object.top=ease(e,x,t,b,c,d);break;
          case "centerX":object.centerX=ease(e,x,t,b,c,d);break;
          case "centerY":object.centerY=ease(e,x,t,b,c,d);break;
          case "scl":object.scl=ease(e,x,t,b,c,d);break;
          case "rot":object.rot=ease(e,x,t,b,c,d);break;
          case "transform":
            var c=[];for(var i=0;i< b.length;i++){c[i]=nextKey.value[i]-curKey.value[i];}
            object.transform=[
              ease(e,x,t,b[0],c[0],d),
              ease(e,x,t,b[1],c[1],d),
              ease(e,x,t,b[2],c[2],d),
              ease(e,x,t,b[3],c[3],d),
              ease(e,x,t,b[4],c[4],d),
              ease(e,x,t,b[5],c[5],d)];
            break;
          case "strokeWeight":object.strokeW=ease(e,x,t,b,c,d);break;
          case "stroke":
            var c1=hexRGBA(curKey.value);
            var c2=hexRGBA(nextKey.value);
            object.strokeR=parseInt(ease(e,x,t,c1[0],c2[0]-c1[0],d));
            object.strokeG=parseInt(ease(e,x,t,c1[1],c2[1]-c1[1],d));
            object.strokeB=parseInt(ease(e,x,t,c1[2],c2[2]-c1[2],d));
            object.strokeA=1/255*ease(e,x,t,c1[3],c2[3]-c1[3],d);
            break;
          case "fill":
            var c1=hexRGBA(curKey.value);
            var c2=hexRGBA(nextKey.value);
            object.fillR=parseInt(ease(e,x,t,c1[0],c2[0]-c1[0],d));
            object.fillG=parseInt(ease(e,x,t,c1[1],c2[1]-c1[1],d));
            object.fillB=parseInt(ease(e,x,t,c1[2],c2[2]-c1[2],d));
            object.fillA=1/255*ease(e,x,t,c1[3],c2[3]-c1[3],d);                
            break;
          case "opac":object.opac=ease(e,x,t,b,c,d);break;
        }
    }else if(frame>=nextKey.frame||frame==0){
      var b=curKey.value;
      switch(curProp){
      case "left":object.left=b;break;
      case "top":object.top=b;break;
      case "centerX":object.centerX=b;break;
      case "centerY":object.centerY=b;break;
      case "scl":object.scl=b;break;
      case "rot":object.rot=b;break;
      case "transform":object.transform=[b[0],b[1],b[2],b[3],b[4],b[5]];
      case "strokeWeight":object.strokeW=b;break;
      case "stroke":
        var c=hexRGBA(b);            
        object.strokeR=c[0];
        object.strokeG=c[1];
        object.strokeB=c[2];
        object.strokeA=1/255*c[3]            
        break;
      case "fill":
        var c=hexRGBA(b);
        object.fillR=c[0];
        object.fillG=c[1];
        object.fillB=c[2];
        object.fillA=1/255*c[3];
        break;
      case "opac":object.opac=b;break;
      }
    }        
  
  } // engine end
      
  burst.prototype.is=function(){
    return this.version;
  }
  
  burst.prototype.start=function(tls,cb){
    //this.buffer=[];
    var tl=tls.split(";");
    for(var j=0;j<this.timelines.length;j++){
      for(var i=0;i<tl.length;i++){
        if(this.timelines[j].name==tl[i]){
          this.load(this.timelines[j],cb);
          break;
        }
      }
    }
    this.play();
  }
  
  burst.prototype.clear=function(){
    this.buffer=[];
  }
  
  burst.prototype.stop=function(tls){    
    // To stop a child timeline you will have to stop the parent too.
    // ..thinking of making a recursive search to find and stop children.
    var tl=tls.split(";");
    for(var j=0;j<this.timelines.length;j++){
      for(var i=0;i<tl.length;i++){
        if(this.timelines[j].name==tl[i]){
          this.buffer.remove(j,j);
          break;
        }
      }
    }
  }
  
  burst.prototype.chain=function(tlchain,cb){
    var thisBurstInstance=this;
    var nextcb;
    buffer=[];        
    // Detect & remove extra ';' at the end of chain
    if(tlchain[tlchain.length-1]==";"){ 
      tlchain=tlchain.substr(0,tlchain.length-1)
    };
    var splitPos=tlchain.indexOf(";");
    if(splitPos>-1){
      tl=tlchain.slice(0,splitPos);
      tlchain=tlchain.slice(tlchain.indexOf(";")+1);
      nextcb=function(){thisBurstInstance.chain(tlchain,cb)};
    }else{
      tl=tlchain;
      nextcb=cb;
    }        
    for(var j=0;j<this.timelines.length;j++ ){         
      if(this.timelines[j].name==tl){      
        this.load(this.timelines[j],nextcb);
        break;
      }
    }
    this.play();        
  }

  burst.prototype.pause=function(){
      return this.paused?this.paused=false:this.paused=true;
  }

  burst.prototype.pauseAt=function(tl,onFrame){
    for (var i=0; i<tl.length; i++){
      if(typeof tl[i] == "string") {
        for (var j=0; j < this.timelines.length; j++ ) {
          this.timelines[j].name==tl[i]?this.timelines[j].pause(onFrame) :0; 
        }
      }else{
        tl[i].pause(onFrame);
      }
    }
  }

  burst.prototype.timeline=function(name,frameOffset,lastFrame,playSpeed,loop){        
    for(var i=0; i<this.timelines.length; i++){
      if(this.timelines[i].name==name){
        return this.timelines[i];
      }
    }
    this.timelines[this.timelines.length] = new burst.prototype.timelineobject(name, frameOffset, lastFrame, playSpeed, loop, this);
    return this.timelines[this.timelines.length-1];
  }
    
  burst.prototype.load=function(tl,cb){
    tl.playSpeed>=0?tl.frame=0:tl.frame=tl.lastFrame;
    tl.callbackfired=false;
    this.buffer[this.buffer.length]=[tl,cb];                              
  }

  // AJAX function based on http://www.hunlock.com/blogs/Snippets:_Synchronous_AJAX
  burst.prototype.get=function(url){
    if(window.XMLHttpRequest){AJAX=new XMLHttpRequest();}
    else{AJAX=new ActiveXObject("Microsoft.XMLHTTP");}
    if(AJAX){
       AJAX.open("GET",url,false);
       AJAX.send(null);
       return AJAX.responseText;
    }else{return false;}
  }
  
  burst.prototype.split=function(stringToSplit,divider1,divider2,divider3,divider4){
    var i,j,k;
    if(!divider2){return stringToSplit.split(divider1);}
    else if(!divider3){
        var multiArray=stringToSplit.split(divider1);          
        for(i=0;i<multiArray.length;i++){
          var level2=multiArray[i].split(divider2);                            
          multiArray[i]=new Array(level2.length);                        
          for(j=0;j<level2.length;j++){multiArray[i][j]=level2[j];}               
        }
        return multiArray;
    }else{
      var multiArray=stringToSplit.split(divider1);          
      for(i=0;i<multiArray.length;i++){            
        var level2=multiArray[i].split(divider2);                            
        multiArray[i]=new Array(level2.length);                        
        for(j=0;j<level2.length;j++){                      
          multiArray[i][j]=level2[j];
          var level3=multiArray[i][j].split(divider3);                            
          multiArray[i][j]=new Array(level3.length);                        
          for(k=0;k<level3.length;k++){multiArray[i][j][k]=level3[k];}                        
        }
      }
      return multiArray;
    }
  }
  
  burst.prototype.loadOFF=function(url){
    var points = this.get(url).split("\n");
    points.remove(0,1);
    points.remove(points.length-1);
    var i,j;
    for (var i=0;i<points.length;i++){
      var vertex=points[i].split(" ");
      points[i]=new Array(vertex.length);
      for (var j=0;j<vertex.length;j++){                   
        points[i][j]=vertex[j];
      }
    }    
    //console.log(points);
    return points;
  }
    
  burst.prototype.loadRAW=function(url){}
  
  
  
  // Load SVG file...
  burst.prototype.loadSVG=function(url,mode){
    var nodeIndex=0;
    var has = burst.prototype.has;
    var hexRGBA = burst.prototype.hexRGBA; 
    var curNode;
    var xmlDoc; 
    var gradients=[];
    var svg = [];
    //use this.O to make clones rather than simgular links?
    var O = new burst.prototype.SVG("url"); // The new SVG object to be returned
    var g;
    
    // Load XML doc AJAX
    function loadXML(){
      try{xmlDoc=new ActiveXObject("Microsoft.XMLDOM");}
      catch(e){try{xmlDoc=document.implementation.createDocument("","",null);}
      catch(e){alert(e.message);return;}}      
       try // Good browsers: Firefox, Mozilla, Opera, etc.
          {
          xmlDoc.async=false;
          xmlDoc.load(url);
          svg = xmlDoc.getElementsByTagName("svg")[0];
          O.width=parseFloat(svg.getAttribute("width"));
          O.height=parseFloat(svg.getAttribute("height"));
          parseSVG(svg,"svg");
          }
        catch(e)
           {
        try // Naughty browsers: Google Chrome, Safari etc.
          {
           var xmlhttp = new window.XMLHttpRequest();
           xmlhttp.open("GET",url,false);
           xmlhttp.send(null);
           svg = xmlhttp.responseXML.documentElement;
           O.width=parseFloat(svg.getAttribute("width"));
           O.height=parseFloat(svg.getAttribute("height"));
           parseSVG(svg,"svg");
          }
        catch(e)
          {
            error=e.message;            
          }
        }
    }
    
    function parseSVG(node,parentTag){
      var doFill=false;
      var doStroke=false;
      var doState=false;  
      var setGlobalAlpha = true;
      var sc=[]; // stroke color
      var fc=[]; // fill color
      var o=1.0; // opacity
      
      // Regular expressions for SVG
      var findURLGradient = "(url[(]#)(.[^)]+)";
      var findHEXColor = "(#[0-9a-f]{6})";
      var findTranslate = "(translate[(])([0-99\. \-]+)(,)([0-99\. \-]+)";
      var findMatrix = "(matrix[(])([0-9\-\. ]+)(,)([0-9\-\. ]+)(,)([0-9\-\. ]+)(,)([0-9\-\. ]+)(,)([0-9\-\. ]+)(,)([0-9\-\. ]+)([)])"
      var findPathCommands = "([a-zA-Z][0-9\- \.\,]+[^a-zA-Z])|(z|Z)";
      var findXYx2 = "([0-9\-\.]+){2}";
      var findXYx6 = "([0-9\-\.]+)"; //"([0-9\-\.]+){6}";
      // Regular expression function
      regex=function(needle, hay){
        var regexp=new RegExp(needle,"g");
        var i=0;
        var results=[];
        while(results[i]=regexp.exec(hay)){i++;}
        return results;
      }
  
      // :: Transform & Matrix :::::::::::::::::::::::::::::::::::::::::::::::::::
      transform=function(node){
        var p = curNode.getAttribute("transform");
        if(v=regex(findTranslate,p)[0]){O.add([v[2],v[4]],function(a){ctx.translate(a[0],a[1]);},g);}
        if(v=regex(findMatrix,p)[0]){O.add([v[2],v[4],v[6],v[8],v[10],v[12]],function(a){ctx.transform(a[0],a[1],a[2],a[3],a[4],a[5]);},g);}
      }
      // :: Path :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      path=function(node){
        O.add(0,function(){ctx.beginPath();},g);
        transform(curNode);
        var command=regex(findPathCommands,curNode.getAttribute("d"));
        for(var i=0;i<command.length-1;i++){
          var c=0;
          switch(command[i][0][0]){
          case "M":c=regex(findXYx2,command[i][0]);O.add([c[0][0],c[1][0]],function(a){ctx.moveTo(a[0],a[1])},g);break;
          case "C":c=regex(findXYx6,command[i][0]);O.add([c[0][0],c[1][0],c[2][0],c[3][0],c[4][0],c[5][0]],function(a){ctx.bezierCurveTo(a[0],a[1],a[2],a[3],a[4],a[5]);},g);break;
          case "Q":c=regex(findXYx6,command[i][0]);O.add([c[0][0],c[1][0],c[2][0],c[3][0],c[4][0],c[5][0]],function(a){ctx.bezierCurveTo(a[0],a[1],a[2],a[3],a[4],a[5]);},g);break; 
          case "A":
              c=regex(findXYx6,command[i][0]);
              O.add([c[0][0],c[1][0],c[2][0],c[3][0],c[4][0],c[5][0]],function(a){ctx.arcTo(a[0],a[1],a[2],a[3],a[4],a[5]);},g);
              break;
          case "L":c=regex(findXYx2,command[i][0]);O.add([c[0][0],c[1][0]],function(a){ctx.lineTo(a[0],a[1])},g);break;       
          case "Z":O.add(0,function(){ctx.closePath()},g);break;
          case "z":O.add(0,function(){ctx.closePath()},g);break;
          }
        }
        style(curNode);
        doFill?O.add(0,function(){ctx.fill()},g):0;
        doStroke?O.add(0,function(){ctx.stroke()},g):0;
      }
      // :: Rect :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      rect=function(node){
        transform(curNode);
        var width = curNode.getAttribute("width");
        var height = curNode.getAttribute("height");
        var x = curNode.getAttribute("x");
        var y = curNode.getAttribute("y");
        style(curNode);         
        doFill?O.add([x,y,width,height],function(a){ctx.fillRect(a[0],a[1],a[2],a[3])},g):0;        
        doStroke?O.add([x,y,width,height],function(a){ctx.strokeRect(a[0],a[1],a[2],a[3])},g):0;                        
      }
      // :: Style ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      style=function(curNode){
        doFill=false;
        doStroke=false;
        var fillGrad = false;
        var strokeGrad = false;
        if(setGlobalAlpha==true){O.add('',function(){ctx.globalAlpha=1;},g);setGlobalAlpha=false;}
        var so=1, fo=1, o=1; // stroke-opacity, fill-opacity, global-alpha/opacity
        var styles = curNode.getAttribute("style").split(";");        
        for(var i=0;i<styles.length;i++){
          var propval = styles[i].split(":"); //console.log(propval); 
          switch(propval[0]){
          case "opacity": o=propval[1]; setGlobalAlpha=true;O.add(o,function(a){ctx.globalAlpha=a;},g);break;
          case "stroke-width": var linewidth = parseFloat(propval[1]); O.add(linewidth,function(a){ctx.lineWidth=a;},g); break;
          case "stroke-linecap": var linecap = propval[1]; O.add(linecap,function(a){ctx.lineCap=a;},g); break;
          case "stroke-linejoin": var linejoin = propval[1]; O.add(linejoin,function(a){ctx.lineJoin=a;},g); break;
          case "stroke-miterlimit": var miterlimit = parseFloat(propval[1]);O.add(miterlimit,function(a){ctx.miterLimit=a;},g); break;
          case "fill-opacity":fo=propval[1];break;
          case "fill":
            if(propval[1]!="none"){
              doFill=true;
              if(has("url(#",propval[1])){
                fillGrad = true;
                var gradientURL=regex(findURLGradient,propval[1])[0][2];
                //console.log(gradientURL)
                for(var u=0;u<gradients.length;u++){                  
                  if(gradients[u][0]==gradientURL){                      
                      O.add(gradients[u][1],function(a){ctx.fillStyle=a;},g);
                      break;
                  }
                }
              }else if(burst.prototype.has("#",propval[1])){
                fc=hexRGBA(propval[1].substr(1,6));
                fillGrad = false;
              }
            }
            break;
          case "stroke-opacity":so=propval[1]; break;                 
          case "stroke":
              if(propval[1]!="none"){
                doStroke=true;
                if(has("url(#",propval[1])){
                  strokeGrad = true;
                  var gradientURL=regex(findURLGradient,propval[1])[0][2];                  
                  for(var u=0;u<gradients.length;u++){
                    if(gradients[u][0]==gradientURL){
                        O.add(gradients[u][1],function(a){ctx.strokeStyle=a;},g);                        
                        break;
                    }
                  }
                }else if(has("#",propval[1])){
                  sc=hexRGBA(propval[1].substr(1,6));
                  strokeGrad = false;
                }
              }
              break;
          }
        }
        
        // Build fill/stroke grads/opacs etc
        if (fillGrad==false && doFill==true){
          var aCol='rgba('+fc[0]+','+fc[1]+','+fc[2]+','+fo+')';                
          O.add(aCol,function(a){ctx.fillStyle=a;},g);
        }
        if (strokeGrad==false && doStroke==true){
          var aCol='rgba('+sc[0]+','+sc[1]+','+sc[2]+','+so+')';
          O.add(aCol,function(a){ctx.strokeStyle=a;},g);
        }
      }
      
      // :: Gradients ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      gradient=function(node,type){                              
        switch(type){
        case "linear":
          var xlink="";
          if(xlink=node.getAttribute("xlink:href")){
            var x1=node.getAttribute("x1");
            var y1=node.getAttribute("y1");
            var x2=node.getAttribute("x2");
            var y2=node.getAttribute("y2");
            gradients[gradients.length]=[node.getAttribute("id"),ctx.createLinearGradient(x1,y1,x2,y2)];            
            xlink=xlink.split("#")[1];
            var en = svg.getElementsByTagName("linearGradient"); // radials link to linears            
            for(var e=0;e<en.length;e++){
              if(en[e].getAttribute("id")==xlink){
                break;
              }
            }
            var i=0;
            var colorStop;
            while(colorStop=en[e].getElementsByTagName("stop")[i]){i++;
              var stopStyle;
              var j=0;
              while(stopStyle=colorStop.getAttribute("style").split(";")[j]){j++;
                var stopOffset=colorStop.getAttribute("offset");
                var stopProp=stopStyle.split(":");
                switch(stopProp[0]){
                  case "stop-color":var gc=hexRGBA(stopProp[1].substr(1,6));break;
                  case "stop-opacity":var gop=stopProp[1];break;
                }
              }
              //console.log( stopOffset,'rgba('+gc[0]+','+gc[1]+','+gc[2]+','+gop+')' );
              gradients[gradients.length-1][1].addColorStop(stopOffset,'rgba('+gc[0]+','+gc[1]+','+gc[2]+','+gop+')');
            }            
          } else { //console.log("no xlink for: "+node.getAttribute("id")); 
          }
          break;
        case "radial":
          var xlink;          
          if(xlink=node.getAttribute("xlink:href")){
            var cx=node.getAttribute("cx");
            var cy=node.getAttribute("cy");
            var r =node.getAttribute("r");
            var fx=node.getAttribute("fx");
            var fy=node.getAttribute("fy");
            //c=regex(findXYx6,node.getAttribute("gradientTransform"));            
            gradients[gradients.length]=[node.getAttribute("id"),ctx.createRadialGradient(cx,cy,0,fx,fy,r)];
            xlink=xlink.split("#")[1];                                                            
            var en = svg.getElementsByTagName("linearGradient"); // radials link to linears
            for(var e=0;e<en.length;e++){
              if(en[e].getAttribute("id")==xlink){
                break;
              }              
            }            
            var i=0;
            var colorStop;
            while(colorStop=en[e].getElementsByTagName("stop")[i]){i++;
              var stopStyle;
              var j=0;
              while(stopStyle=colorStop.getAttribute("style").split(";")[j]){j++;                
                var stopOffset = colorStop.getAttribute("offset");
                var stopProp = stopStyle.split(":");
                switch(stopProp[0]){
                  case "stop-color":var gc=hexRGBA(stopProp[1].substr(1,6));break;
                  case "stop-opacity":var gop=stopProp[1];break;
                }
              }
              gradients[gradients.length-1][1].addColorStop(stopOffset,'rgba('+gc[0]+','+gc[1]+','+gc[2]+','+gop+')');
            }
          }
          break;
        }
      }
      
      // Parse Tags by Name
      for(var i=0;i<node.childNodes.length;i++){
        curNode = node.childNodes[i];
        curTagName = node.childNodes[i].tagName;
        if(node.tagName=="svg"){g=curNode.id;}
        switch(curTagName){
          case "defs"          :parseSVG(curNode);break;
          case "linearGradient":gradient(curNode,"linear");break;
          case "radialGradient":gradient(curNode,"radial");break;
          case "g"             :
              O.add([],function(){ctx.save();},g);           
              transform(curNode);parseSVG(curNode);              
              O.add([],function(){ctx.restore();},g);
              break;
          case "path"          :
              O.add([],function(){ctx.save();},g);
              path(curNode);
              O.add([],function(){ctx.restore();},g);
              break;
          case "rect"          :
              O.add([],function(){ctx.save();},g);
              rect(curNode);
              O.add([],function(){ctx.restore();},g);
              break;
        }
      }
    }
    
    loadXML();
    //O.render();
    //O.breakflow();
    return O;
  }
  
  burst.prototype.drawNextFrame=function(){
    //Always runs this function before drawing a frame
    this.alwaysFunction();
    
    // Play the frame if not paused
    if(!this.paused){
      ctx.clearRect(0,0,this.width,this.height);
      this.frame++;
      for(var i=0;i<this.buffer.length;i++){
        this.buffer[i][0].play(this.buffer[i][1]);
      }
    }
  }
  
  burst.prototype.play=function(){
    var instance=this;
    window.setInterval(function(){instance.drawNextFrame();},this.mspf);
  }
  
  
  //////// S V G - O B J E C T /////////////////////////////////////////////////
  burst.prototype.SVG=function(url,width,height){
  this.url=url;
  this.groups=[];
  this.width=width;
  this.height=height;
  this.type="SVGobject";
  }
  burst.prototype.SVG.prototype.groups;
  
  burst.prototype.SVG.prototype.groupobject=function(groupID,isParent){
  this.centerX=0;
  this.centerY=0;
  this.tracks=[];
  this.id=groupID;
  this.left=0;
  this.top=0;
  this.scl=1;
  this.rot=0;  
  this.opac=1;
  this.transform=[1,0,0,1,0,0];
  this.f=[]; // functions
  this.a=[]; // arguments
  this.c=0;  // func/args count
  this.isParent=isParent;
  this.cut=false;
  return this;
  }
  burst.prototype.SVG.prototype.groupobject.prototype.id;
  burst.prototype.SVG.prototype.groupobject.prototype.left;
  burst.prototype.SVG.prototype.groupobject.prototype.top;
  burst.prototype.SVG.prototype.groupobject.prototype.scl;
  burst.prototype.SVG.prototype.groupobject.prototype.rot;
  burst.prototype.SVG.prototype.groupobject.prototype.opac;
  burst.prototype.SVG.prototype.groupobject.prototype.transform;
  burst.prototype.SVG.prototype.groupobject.prototype.centerX;
  burst.prototype.SVG.prototype.groupobject.prototype.centerY;
  
  burst.prototype.SVG.prototype.groupobject.prototype.debug=function(groupID){
    debug("bounds", this);
  }
  
  //Return Group (SVG groups)
  burst.prototype.SVG.prototype.groupobject.prototype.group=function(groupID){
    for(var i=0;i< this.isParent.groups.length; i++){
      if(this.isParent.groups[i].id==groupID){return this.isParent.groups[i];}
    }
  }      
  
  burst.prototype.SVG.prototype.groupobject.prototype.add=function(newArgs,newFunc){  
    this.a[this.c]=newArgs;
    this.f[this.c]=newFunc;
    this.c++;
    burst.prototype.debug(newArgs, newFunc);
    burst.prototype.debug(this.f[this.c], this.a[this.c],this.id);    
  }
  
  burst.prototype.SVG.prototype.groupobject.prototype.render=function(){    
    ctx.save();
    ctx.translate(this.left+this.centerX,this.top+this.centerY);
    ctx.scale(this.scl,this.scl);
    ctx.rotate(burst.prototype.radians(this.rot));
    ctx.translate(-this.centerX,-this.centerY);
    
    t=this.transform;ctx.transform(t[0],t[1],t[2],t[3],t[4],t[5]);    
    for(var i=0;i<this.f.length;i++){      
      this.f[i](this.a[i]);
    }
    ctx.globalAlpha=1;
    ctx.restore();
  }
  
  burst.prototype.SVG.prototype.groupobject.prototype.track=function(property){
    for(var i=0;i<this.tracks.length;i++){
      if(this.tracks[i].property==property){
        return this.tracks[i];
      }
    }
    this.tracks[this.tracks.length]=new burst.prototype.trackprop(property,this);
    return this.tracks[this.tracks.length-1];
  }
  
  burst.prototype.SVG.prototype.add=function(newArgs,newFunc,groupID){            
    var gotMatch=false;
    for(var i=0;i< this.groups.length;i++){
      if(this.groups[i].id==groupID){
         this.groups[i].add(newArgs,newFunc);
         gotMatch=true;
         break;
      }
    }
    if(gotMatch==false){
      this.groups[this.groups.length]=new burst.prototype.SVG.prototype.groupobject(groupID,this);
      this.groups[this.groups.length-1].add(newArgs,newFunc);
    }
  }
      
  burst.prototype.SVG.prototype.render=function(){    
    for(var i=0;i<this.groups.length;i++){
      if(this.groups[i].cut==false){
        this.groups[i].render();        
        if(burst.prototype.defaults.debug==true){
          burst.prototype.debug("bounds",this.groups[i]);
        }
      }
    }
  }  
  
  burst.prototype.SVG.prototype.cut=function(groupIDs){    
    var groupIDs=groupIDs.split(";");
    for(var j=0;j< groupIDs.length;j++){
      for(var i=0;i< this.groups.length;i++){        
        if(groupIDs[j]==this.groups[i].id){
          this.groups[i].cut=true;
        }
      }
    }
  }
  
////////////////////////////////////////////////////////////////////////////////

//////// T I M E L I N E ///////////////////////////////////////////////////////
burst.prototype.timelineobject=function(name,frameOffset,lastFrame,playSpeed,loop,isParent){  
  this.name=name;
  this.width=isParent.width;
  this.height=isParent.height;
  this.type="timeline";
  this.frameOffset=frameOffset;
  this.lastFrame=lastFrame;
  this.playSpeed=playSpeed;
  this.loop=loop
  this.paused=false;
  this.shapes=[];
  this.timelines=[];
  this.frame=0;
  this.callbackfired=false;    
  this.randomCount=0;
  this.playMode="";
  this.tracks=[];
  this.effects=[];    
  this.scl=1.0;
  this.sclX=1.0;
  this.sclY=1.0; 
  this.left=0;
  this.top=0;
  this.rot=0.0;
  this.strokeW=0;
  this.strokeHex="00000000";
  this.strokeRGBA=burst.prototype.hexRGBA(this.strokeHex);
  this.strokeR=this.strokeRGBA[0];
  this.strokeG=this.strokeRGBA[1];
  this.strokeB=this.strokeRGBA[2];
  this.strokeA=this.strokeRGBA[3];
  this.fillHex="00000000";
  this.fillRGBA=burst.prototype.hexRGBA(this.fillHex);
  this.fillR=this.fillRGBA[0];
  this.fillG=this.fillRGBA[1];
  this.fillB=this.fillRGBA[2];
  this.fillA=this.fillRGBA[3];    
  this.opac=1.0;
  this.centerX=0//this.width/2;
  this.centerY=0//this.height/2;
  this.isParent = isParent;
  this.cuts=[];
  this.alwaysFunction=function(){};
  }
    
  burst.prototype.timelineobject.prototype.name;  
  burst.prototype.timelineobject.prototype.type;
  burst.prototype.timelineobject.prototype.frameOffset;
  burst.prototype.timelineobject.prototype.lastFrame;
  burst.prototype.timelineobject.prototype.playSpeed;
  burst.prototype.timelineobject.prototype.paused;
  burst.prototype.timelineobject.prototype.loop;
  burst.prototype.timelineobject.prototype.shapes;
  burst.prototype.timelineobject.prototype.timelines;
  burst.prototype.timelineobject.prototype.frame;
  burst.prototype.timelineobject.prototype.callbackfired;    
  burst.prototype.timelineobject.prototype.randomCount;
  burst.prototype.timelineobject.prototype.playMode;
  burst.prototype.timelineobject.prototype.tracks;
  burst.prototype.timelineobject.prototype.effects;    
  burst.prototype.timelineobject.prototype.scl; 
  burst.prototype.timelineobject.prototype.left;
  burst.prototype.timelineobject.prototype.top;
  burst.prototype.timelineobject.prototype.rot;
  burst.prototype.timelineobject.prototype.width;
  burst.prototype.timelineobject.prototype.height;
  burst.prototype.timelineobject.prototype.strokeW;
  burst.prototype.timelineobject.prototype.strokeHex;
  burst.prototype.timelineobject.prototype.strokeRGBA;
  burst.prototype.timelineobject.prototype.strokeR;
  burst.prototype.timelineobject.prototype.strokeG;
  burst.prototype.timelineobject.prototype.strokeB;
  burst.prototype.timelineobject.prototype.strokeA;        
  burst.prototype.timelineobject.prototype.fillHex;            
  burst.prototype.timelineobject.prototype.fillRGBA;
  burst.prototype.timelineobject.prototype.fillR;
  burst.prototype.timelineobject.prototype.fillG;
  burst.prototype.timelineobject.prototype.fillB;
  burst.prototype.timelineobject.prototype.fillA;        
  burst.prototype.timelineobject.prototype.opac;
  burst.prototype.timelineobject.prototype.centerX;
  burst.prototype.timelineobject.prototype.centerY;
  burst.prototype.timelineobject.prototype.isParent;
  burst.prototype.timelineobject.prototype.alwaysFunciton;      
  
  burst.prototype.timelineobject.prototype.always=function(aFunc){
    this.alwaysFunction=aFunc;
  }    
  
  // Build &/or Return Shape
  burst.prototype.timelineobject.prototype.shape=function(name,url,mode,left,top,scl,rot,strokeW,strokeHex,fillHex,zIndex,opac,isParent){             
    for(var i=0; i < this.shapes.length; i++){
        if (this.shapes[i].name==name){ 
          return this.shapes[i];
        }
    }
    this.shapes[this.shapes.length] = new burst.prototype.timelineobject.prototype.shapeobject(name,url,mode,left,top,scl,rot,strokeW,strokeHex,fillHex,zIndex,opac,this);
    return this.shapes[this.shapes.length-1];
  }
    
  // Pause on frame..
  burst.prototype.timelineobject.prototype.pause=function(onFrame){
    if(onFrame){
      this.frame=onFrame;
      this.paused=true;
    }else{
      this.paused=true;
    }      
  }
    
  // Inherit timelines as children
  burst.prototype.timelineobject.prototype.inherit=function(tl){
    var inst=this.isParent;
    for(var i=0;i<inst.timelines.length;i++){
      if(inst.timelines[i].name==tl){
        this.timelines[this.timelines.length]=inst.timelines[i];
        return this; //inst.timelines[i];
      }
    }
  }
  
  // Play child-timelines
  burst.prototype.timelineobject.prototype.playChildren=function(){
    for(var i=0;i<this.timelines.length;i++){
      if(this.timelines[i].paused==false){
        this.timelines[i].frame+=this.timelines[i].playSpeed+(this.timelines[i].playSpeed/this.playSpeed)
      }
      this.timelines[i].play();      
    }
  }
    
  // Callback Exceution
  burst.prototype.timelineobject.prototype.callback=function(cb){
    if(cb!=undefined&&this.callbackfired==false){
      this.callbackfired=true;
      cb();
    }
  }
  
  // Return Track
  burst.prototype.timelineobject.prototype.track=function(property){
    for(var i=0;i<this.tracks.length;i++){
      if(this.tracks[i].property==property){
        return this.tracks[i];
      }
    }
    this.tracks[this.tracks.length]=new burst.prototype.trackprop(property,this);
    return this.tracks[this.tracks.length-1];
  }

  // Play Timeline
  burst.prototype.timelineobject.prototype.play=function(cb){
    this.alwaysFunction();
        
    var radians=burst.prototype.radians;
    
    this.playSpeed<0?playMode="backward":playMode="forward";
    if(this.paused==false){
      switch(playMode){
      case "forward":
        this.frame<this.lastFrame?this.frame=this.frame+this.playSpeed:this.loop==true?this.frame=0:(cb)?this.callback(cb):0;        
        break;
      case "backward":
        this.frame>=1-this.playSpeed?this.frame=this.frame+this.playSpeed:this.loop==true?this.frame=this.lastFrame:(cb)?this.callback(cb):0;        
        break;
      case "random":
        this.frame=random(this.lastFrame);
        if(randomCount<this.lastFrame){randomCount++;}else{if(loop){(cb)?this.callback(cb):0;}}
        break;
      }
    }

    // Send Timeline to Burst Engine
    for(var i=0;i<this.tracks.length;i++){
      var curTrack=this.tracks[i];
      for(var j=0;j<curTrack.keys.length;j++){
          var curProp=this.tracks[i].property;
          var curKey=this.tracks[i].keys[j];
          if(j<curTrack.keys.length-1){var nextKey=curTrack.keys[j+1];}else{var nextKey=curTrack.keys[j];}
          burst.prototype.engine(this,this.frame,curProp,curKey,nextKey);
      }
    }

    // Timeline style & matrix            
    ctx.save();
    ctx.translate(this.left+this.centerX,this.top+this.centerY);
    ctx.rotate(radians(this.rot));    
    this.sclX!=this.sclY?ctx.scale(this.sclX, this.sclY):ctx.scale(this.scl,this.scl);
    ctx.translate(-this.centerX,-this.centerY);
    ctx.doFill=true;    
    ctx.fillStyle="rgba("+this.fillR+","+this.fillG+","+this.fillB+","+this.fillA+")";  
    ctx.strokeStyle="rgba("+this.strokeR+","+this.strokeG+","+this.strokeB+","+this.strokeA+")";
    ctx.lineWidth=this.strokeW;
    ctx.globalAlpha=this.opac;    
    
    ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(this.width,0);
      ctx.lineTo(this.width,this.height);
      ctx.lineTo(0,this.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Animate Shapes
    for(var i=0;i<this.shapes.length;i++){
      var curShape=this.shapes[i];
      for(var j=0;j<curShape.tracks.length;j++){  
        for(var k=0;k<this.shapes[i].tracks[j].keys.length;k++){                    
          var curTrack=this.shapes[i].tracks[j];  // can make some kb savings here with all the needless "var this[]i.whatever" stuff
          var curProp=this.shapes[i].tracks[j].property;
          var curKey=this.shapes[i].tracks[j].keys[k];
          if(k<curTrack.keys.length-1){var nextKey=curTrack.keys[k+1];}else{var nextKey=curTrack.keys[k];}          
          burst.prototype.engine(curShape,this.frame,curProp,curKey,nextKey);
        }
      }
      // Animate any SVG Groups
      for(var l=0;l<curShape.obj.groups.length;l++){
        var curGroup=curShape.obj.groups[l];
        for(var m=0;m<curGroup.tracks.length;m++){
          var curTrack=curGroup.tracks[m];
          for(var o=0;o<curTrack.keys.length;o++){                                
            var curProp=curTrack.property;
            var curKey=curTrack.keys[o];
            if(o<curTrack.keys.length-1){var nextKey=curTrack.keys[o+1];}else{var nextKey=curTrack.keys[o];}                
            burst.prototype.engine(curGroup,this.frame,curProp,curKey,nextKey);
          }
        }
      }
    }    
                
    this.draw(this.frame);
    this.playChildren();
    ctx.restore();
  }
    
  burst.prototype.timelineobject.prototype.draw=function(){
    for(var i=0;i<this.shapes.length;i++){
      this.shapes[i].draw(this.frame);
      this.isParent.debug("bounds",this);
    }
  }    
  
////////////////////////////////////////////////////////////////////////////////  



//////// S H A P E /////////////////////////////////////////////////////////////
burst.prototype.timelineobject.prototype.shapeobject=function(name,url,mode,left,top,scl,rot,strokeW,strokeHex,fillHex,zIndex,opac,isParent){  
  hexRGBA = burst.prototype.hexRGBA;
  this.name=name;
  this.url=url;
  this.extension = url.split(/([\.][a-zA-Z0-9]+)/)[1];
  //console.log(this.extension);
  this.obj=[];  
  this.isParent=isParent;
  this.mode=mode;
  this.checkMemory(this.isParent);  
  this.left=left;
  this.top=top;
  !scl?this.scl=1:this.scl=scl;
  !rot?this.rot=0:this.rot=rot;
  !strokeW?this.strokeW=1:this.strokeW=strokeW;
  !strokeHex?this.strokeHex="000000ff":this.strokeHex=strokeHex;
  this.strokeRGBA=hexRGBA(this.strokeHex);
  this.strokeR=this.strokeRGBA[0];
  this.strokeG=this.strokeRGBA[1];
  this.strokeB=this.strokeRGBA[2];
  this.strokeA=this.strokeRGBA[3];
  !fillHex?this.fillHex="888888ff":this.fillHex=fillHex;         
  this.fillRGBA=hexRGBA(this.fillHex);
  this.fillR=this.fillRGBA[0];
  this.fillG=this.fillRGBA[1];
  this.fillB=this.fillRGBA[2];
  this.fillA=this.fillRGBA[3];
  this.opac=1.0;
  this.zIndex=1;
  this.centerX=0;
  this.centerY=0;
  this.winding=1;
  this.type="shape";
  this.tracks=[];
  this.effects=[];
  this.shapes=[];
  //this.fx=[][];
  }
  
  burst.prototype.timelineobject.prototype.shapeobject.prototype.name;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.url;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.obj;  
  burst.prototype.timelineobject.prototype.shapeobject.prototype.mode;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.left;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.top;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.scl;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.rot;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.strokeW;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.strokeHex;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.strokeRGBA;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.strokeR;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.strokeG;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.strokeB;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.strokeA;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.fillHex;                
  burst.prototype.timelineobject.prototype.shapeobject.prototype.fillRGBA;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.fillR;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.fillG;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.fillB;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.fillA;        
  burst.prototype.timelineobject.prototype.shapeobject.prototype.opac;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.zIndex;        
  burst.prototype.timelineobject.prototype.shapeobject.prototype.centerX;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.centerY;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.winding;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.type;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.tracks;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.effects;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.shapes;
  burst.prototype.timelineobject.prototype.shapeobject.prototype.fx;  
  burst.prototype.timelineobject.prototype.shapeobject.prototype.isParent;  

  burst.prototype.timelineobject.prototype.shapeobject.prototype.angleTo=function(object){
    return burst.prototype.degrees(-Math.atan2(this.left+this.centerX - object.left+object.centerX, this.top+this.centerY - object.top+object.centerY) + (Math.PI/2))-90
  }
  
  // Inherit
  burst.prototype.timelineobject.prototype.shapeobject.prototype.inherit=function(name,url,mode,left,top,scl,rot,strokeWeight,strokeHex,fillHex,zIndex,opac){
    var isParent = this.isParent;
    for(var i=0;i<this.shapes.length;i++){
      if(this.shapes[i].name==name){return this.shapes[i];}
    }
    this.shapes[this.shapes.length] = new shapeobject(name,url,mode,left,top,scl,rot,strokeWeight,strokeHex,fillHex,zIndex,opac,isParent);
    this.shapes[this.shapes.length-1].type="subpath";
    return this.shapes[this.shapes.length-1];
  }
    
  // Draw Children
  burst.prototype.timelineobject.prototype.shapeobject.prototype.drawChildren=function(){
    for(var i=0;i<this.shapes.length;i++){
      this.shapes[i].draw();
    }
  }
  
  // Clone shape To..
  burst.prototype.timelineobject.prototype.shapeobject.prototype.cloneTo=function(cloneName){
    //return t
  }
  
  // Parent
  burst.prototype.timelineobject.prototype.shapeobject.prototype.parent=function(){
    return this.isParent;
  }

  // Check Memory & Load
  burst.prototype.timelineobject.prototype.shapeobject.prototype.checkMemory=function(){ // probably should re-write this as so much has changed
    var burstInstance=this.isParent.isParent;
    if(burstInstance.urlIndex.length>0){
      urlMatch=false;
      for(var i=0;i<burstInstance.urlIndex.length;i++){
        if(burstInstance.urlIndex[i]==this.url){
          switch(this.extension){
          case ".off": this.obj=burstInstance.ajaxMem[i+1]; break;
          case ".svg": this.obj=burst.prototype.loadSVG(this.url,this.mode);break;
          }
          urlMatch=true;
          break;
        }
      }
      if(urlMatch==false){
        burstInstance.urlIndex[burstInstance.urlIndex.length]=this.url;
        switch(this.extension){
        case ".off":burstInstance.ajaxMem[burstInstance.urlIndex.length]=burst.prototype.loadOFF(this.url);break;
        case ".svg":burstInstance.ajaxMem[burstInstance.urlIndex.length]=burst.prototype.loadSVG(this.url,this.mode);break;
        }
        this.obj=burstInstance.ajaxMem[burstInstance.urlIndex.length];
      }
    }else{
      burstInstance.urlIndex[burstInstance.urlIndex.length]=this.url;
      switch(this.extension){
      case ".off":burstInstance.ajaxMem[burstInstance.urlIndex.length]=burst.prototype.loadOFF(this.url);break;
      case ".svg":burstInstance.ajaxMem[burstInstance.urlIndex.length]=burst.prototype.loadSVG(this.url,this.mode); break;
      }      
      this.obj = burstInstance.ajaxMem[burstInstance.urlIndex.length];
    }
  }
 
  // [Draw Shape]
  burst.prototype.timelineobject.prototype.shapeobject.prototype.draw=function(frame){    
    var ease=burst.prototype.ease;
    var radians=burst.prototype.radians;
  
    switch(this.extension){
    case ".off":
        ctx.fillStyle="rgba("+this.fillR+","+this.fillG+","+this.fillB+","+this.fillA+")";   
        ctx.strokeStyle="rgba("+this.strokeR+","+this.strokeG+","+this.strokeB+","+this.strokeA+")";
        ctx.lineWidth = this.strokeW;
        ctx.translate(-this.centerX,-this.centerY);
        if(this.type=="shape"){
          ctx.save();
          ctx.translate(this.left+this.centerX,this.top+this.centerY);           
          ctx.rotate(radians(this.rot+90));
          ctx.beginPath();
        }else{ ctx.moveTo(-(this.obj[0][1]*this.scl), this.obj[0][0]*this.scl); }
        for(var i=0;i<this.obj.length;i++){ ctx.lineTo(-(this.obj[i][1]*this.scl),this.obj[i][0]*this.scl); }
        ctx.lineTo(-(this.obj[0][1]*this.scl), this.obj[0][0]*this.scl);      
        if(this.shapes.length>0){ this.drawChildren(); }
        if (this.type=="shape"){
          ctx.lineWidth=this.strokeW;
          ctx.globalAlpha=1;
          ctx.lineTo(-(this.obj[0][1]*this.scl),this.obj[0][0]*this.scl);        
          ctx.closePath();
          ctx.doFill=true;
          ctx.stroke();
          ctx.fill();
          ctx.restore();                    
        }
        break;
    case ".svg":
        ctx.save();
          ctx.translate(this.left,this.top);
          ctx.translate(-this.centerX,-this.centerY);          
            ctx.rotate(radians(this.rot));
          ctx.translate(this.centerX,this.centerY);
          ctx.scale(this.scl,this.scl);
          this.obj.render();
        ctx.restore();
        break;        
    }      
  } // end of [Draw Shape]

  // Return Track
  burst.prototype.timelineobject.prototype.shapeobject.prototype.track=function(property){
    for(var i=0;i<this.tracks.length;i++){
      if(this.tracks[i].property==property){
        return this.tracks[i];
      }
    }
    this.tracks[this.tracks.length]=new burst.prototype.trackprop(property,this);
    return this.tracks[this.tracks.length-1];
  }
 
  //Return Group (SVG groups)
  burst.prototype.timelineobject.prototype.shapeobject.prototype.group=function(groupID){
    for(var i=0;i< this.obj.groups.length; i++){
      if(this.obj.groups[i].id==groupID){return this.obj.groups[i];}
    }
  }
  
  //Return Shape
  burst.prototype.timelineobject.prototype.shapeobject.prototype.shape=function(name,url,mode,left,top,scl,rot,strokeWeight,strokeHex,fillHex,zIndex,opac,isParent){
    return this.isParent.shape(name,url,mode,left,top,scl,rot,strokeWeight,strokeHex,fillHex,zIndex,opac,isParent);
  }
  
  burst.prototype.timelineobject.prototype.shapeobject.prototype.cut=function(groupIDs){
    this.obj.cut(groupIDs);
    return this;
  }  
////////////////////////////////////////////////////////////////////////////////

//////// T R A C K /////////////////////////////////////////////////////////////
burst.prototype.trackprop=function(property,isParent){
  this.property=property;
  this.keys=[];
  this.isParent=isParent;
      
      // KEYS - start //////////////////////////////////////////////////////////
      this.constructor.prototype.keyframe=function(frame,value,easing){
        this.frame=frame;
        this.value=value;
        this.easing=easing;
        this.constructor.prototype.val=function(v){    
          if(v){this.value=v;}else{return this.value;}        
        }
        this.constructor.prototype.ease=function(e){    
          if(e){this.easing=e;}else{return this.easing;}
        }
      }
      // KEYS - end ////////////////////////////////////////////////////////////
  }
  burst.prototype.trackprop.prototype.property;
  burst.prototype.trackprop.prototype.keys;
  burst.prototype.trackprop.prototype.isParent;
  
  // Sort Number
  burst.prototype.trackprop.prototype.sortNumber=function(a,b){return a-b;}
    
  // Return Track
  burst.prototype.trackprop.prototype.track=function(aTrack){return this.isParent.track(aTrack);}
  
  burst.prototype.trackprop.prototype.inherit=function(aTrack){    
    console.log(
       
    );
    this.isParent.inherit(aTrack)
    return this;
    
    //return this.isParent.track.inherit(aTrack);
    //return this.isParent.track(aTrack);    
  }
  
    
  // Return shape object
  burst.prototype.trackprop.prototype.shape=function(name,url,mode,left,top,scl,rot,strokeW,strokeHex,fillHex,zIndex,opac,isParent){
    return this.isParent.shape(name,url,mode,left,top,scl,rot,strokeW,strokeHex,fillHex,zIndex,opac,isParent);
  }
  // Return SVG Group object
  burst.prototype.trackprop.prototype.group=function(groupID){return this.isParent.group(groupID);}
  
  burst.prototype.trackprop.prototype.cut=function(groups){this.isParent.isParent.cut(groups);}

  // Add key
  burst.prototype.trackprop.prototype.key=function(frame,value,easing){        
    !easing?easing=burst.prototype.defaults.ease:0;
    this.keys[this.keys.length]=new burst.prototype.trackprop.prototype.keyframe(frame,value,easing);
    var keyIndex=[];
    for(var i=0;i<this.keys.length;i++){
      keyIndex[i]=this.keys[i].frame;
    }
    keyIndex.sort(this.sortNumber);
    var keyStack=[];
    for(var i=0;i<this.keys.length;i++){
      for(var j=0;j<this.keys.length;j++){
        if(keyIndex[i]==this.keys[j].frame){
          keyStack[i]=this.keys[j];
        }
      }
    }
    this.keys=keyStack;
    return this;
  }
  
  // Return keyframe
  burst.prototype.trackprop.prototype.frame=function(frame){
    for(var i=0;i<keys.length;i++){
      if(keys[i].frame==frame){
          return keys[i];               
      }
    }
  }
////////////////////////////////////////////////////////////////////////////////

//////// I N I T - M A S T E R /////////////////////////////////////////////////
function newBurst(canvasId,BurstScript){  
  if(window.addEventListener){
    window.addEventListener("load",function(){
      var canvas=document.getElementById(canvasId);
      var cWidth=canvas.clientWidth;
      var cHeight=canvas.clientHeight;
      if (!canvas.getContext){
        //console.log("This browser does not support the Canvas object.");
      }else{
        ctx=canvas.getContext('2d');
        var BurstController=new burst("BurstEngine",cWidth,cHeight,canvas);
        BurstScript(BurstController);
      }
    },false);
  }
}
////////////////////////////////////////////////////////////////////////////////

// http://eJohn.org
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};