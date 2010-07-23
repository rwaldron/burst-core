/*
 
  BURST-CORE - by f1lt3r @ bocoup
  License: "Open Source Only" - You can *ONLY* use this code or any darivatives
            of this code in conjunction with other open source code. You may
            however ship this code with other proprietary code/scripts/software
            upon receving comfirmation of your written agreement stating that
            your corporate entity revokes its right to privacy, digital securiry
            and legal action against any of the contributors herein.
  
    track :: name,start,end,speed,loop,callback
    shape :: name,objectRef
    prop  :: name
    key   :: frame,value,easing
*/    
(function(){  
  
  function sortNumber(a,b){ return a - b };
  
  var ease = {
    step          : function(x,t,b,c,d){ if(t==d){return d;}else{return 1;} },
    linear        : function(x,t,b,c,d){ return c*t/d + b; },
    inQuad        : function(x,t,b,c,d){ return c*(t/=d)*t + b; },
    outQuad       : function(x,t,b,c,d){ return -c *(t/=d)*(t-2) + b; },
    inOutQuad     : function(x,t,b,c,d){ if((t/=d/2) < 1) return c/2*t*t + b; return -c/2 * ((--t)*(t-2) - 1) + b; },
    inCubic       : function(x,t,b,c,d){ return c*(t/=d)*t*t + b; },
    outCubic      : function(x,t,b,c,d){ return c*((t=t/d-1)*t*t + 1) + b; },
    inOutCubic    : function(x,t,b,c,d){ if((t/=d/2) < 1) return c/2*t*t*t + b; return c/2*((t-=2)*t*t + 2) + b; },
    inQuart       : function(x,t,b,c,d){ return c*(t/=d)*t*t*t + b; },
    outQuart      : function(x,t,b,c,d){ return -c * ((t=t/d-1)*t*t*t - 1) + b; },
    inOutQuart    : function(x,t,b,c,d){ if((t/=d/2) < 1) return c/2*t*t*t*t + b; return -c/2 * ((t-=2)*t*t*t - 2) + b; },
    inQuint       : function(x,t,b,c,d){ return c*(t/=d)*t*t*t*t + b; },
    outQuint      : function(x,t,b,c,d){ return c*((t=t/d-1)*t*t*t*t + 1) + b; },
    inOutQuint    : function(x,t,b,c,d){ if((t/=d/2) < 1) return c/2*t*t*t*t*t + b; return c/2*((t-=2)*t*t*t*t + 2) + b; },
    inSine        : function(x,t,b,c,d){ return -c * Math.cos(t/d * (Math.PI/2)) + c + b; },
    outSine       : function(x,t,b,c,d){ return c * Math.sin(t/d * (Math.PI/2)) + b; },
    inOutSine     : function(x,t,b,c,d){ return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b; },
    inExpo        : function(x,t,b,c,d){ return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b; },
    outExpo       : function(x,t,b,c,d){ return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; },
    inOutExpo     : function(x,t,b,c,d){ if(t==0) return b; if (t==d) return b+c; if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b; return c/2 * (-Math.pow(2, -10 * --t) + 2) + b; },
    inCirc        : function(x,t,b,c,d){ return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b; },
    outCirc       : function(x,t,b,c,d){ return c * Math.sqrt(1 - (t=t/d-1)*t) + b; },
    inOutCirc     : function(x,t,b,c,d){ if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b; return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b; },
    inElastic     : function(x,t,b,c,d){ var s=1.70158;var p=0;var a=c; if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3; if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; },
    outElastic    : function(x,t,b,c,d){ var s=1.70158;var p=0;var a=c; if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3; if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b; },
    inOutElastic  : function(x,t,b,c,d){ var s=1.70158;var p=0;var a=c; if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5); if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b; },
    inBack        : function(x,t,b,c,d){ if(s == undefined) s = 1.70158; return c*(t/=d)*t*((s+1)*t - s) + b; },
    outBack       : function(x,t,b,c,d){ if(s == undefined) s = 1.70158; return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b; },
    inOutBack     : function(x,t,b,c,d){ if(s == undefined) s = 1.70158;  if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b; return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b; },
    inBounce      : function(x,t,b,c,d){ return c - ease['outBounce']( x, d-t, 0, c, d) + b; },
    outBounce     : function(x,t,b,c,d){ if((t/=d) < (1/2.75)){ return c*(7.5625*t*t) + b; } else if (t < (2/2.75)) { return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b; } else if (t < (2.5/2.75)) { return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b; } else { return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b; } },
    inOutBounce   : function(x,t,b,c,d){ if(t < d/2) return ease['inBounce'](x, t*2, 0, c, d) * .5 + b; return ease['outBounce'](x, t*2-d, 0, c, d) * .5 + c*.5 + b; }
  };
  
  var engine = function engine(frame,prop,curKey,nextKey){
    return ease[ curKey.easing || 'linear' ]( 0,
      frame-curKey.frame,
      curKey.value,
      nextKey.value-curKey.value,
      nextKey.frame-curKey.frame
    );
  };
     
  // BURST //
  var Burst = function()  { 
    this.name = 'Burst Instance ' + new Date();
  };
     
  Burst.prototype = {
    fps           : 30,
    timelines     : {},
    loaded        : {},
    timelineCount : 0,
    timeline      : function(name,start,end,speed,loop,callback)  {
                      //  Checks to see if a timeline of this name already exists
                      //  if it does, then immediately return it.
                      if ( this.timelines[name] ) {
                        return this.timelines[name];
                      }
                      //  If we are creating a new timeline:
                      //  increment the timeline count
                      //  create and return a new timeline entry
                      this.timelineCount ++;
                      return this.timelines[name] = new Timeline(name,start,end,speed,loop,callback,this);
                    },
    
    load: function( name ){
      return this.loaded[name] || (function(){
        for( i in this.timelines ){
          if( this.timelines[i] ){            
            return this.loaded[i] = this.timelines[i];
          }else{
            return this;
          }
        }
      }).call(this);
    },

    unload: function( name ){
      delete this.loaded[name];
    },

    play: function(){
      var deepref = this;
      this.interval = setInterval(function(){
        deepref.frame();
      }, 1000 / this.fps );
    },        
    
    frame: function(){
      for( var i in this.loaded ){
        this.loaded[i].play();
      }
    },
    
    
    stop: function(){
      clearInterval( this.interval );
      delete this.interval;
    }
    
  };  
  
  // TIMELINE //
  var Timeline = function(name,start,end,speed,loop,callback,parent){
    this.name   = name;
    this.start  = start;
    this.end    = end;
    this.speed  = speed;
    this.loop   = loop;
    this.parent = parent;
    this.callback = callback;
    this.frame  = start;
    return this;
  };
  
  Timeline.prototype = {
    shapes      : {},
    shapeCount  : 0,
    shape       : function(name,objectRef){
                    if(typeof props == 'String'){
                      return this.shapes[name];
                    }else{
                      this.timelineCount ++;
                      return this.shapes[name] = new Shape(name,objectRef,this);
                    }
                  },
    tracks      : {},
    trackCount  : 0,
    track       : function(name,parent){
                    if(typeof props == 'String'){
                      return this.tracks[name];
                    }else{
                      this.trackCount ++;
                      return this.tracks[name] = new Track(name,this);
                    }
                  },
    play        : function(){
                    this.frame += this.speed;
                    if( this.loop ){
                      if( this.frame > this.end ){ this.frame = this.start; }
                      if( this.frame < this.start ){ this.frame = this.end; }
                    }else{
                      if( this.frame > this.end){
                        this.frame = this.end;
                        this.parent.unload(this.name);
                        this.callback();
                      }
                      if( this.frame < this.start ){
                        this.frame = this.start;
                        this.parent.unload(this.name);
                        this.callback();
                      }
                    }
                    for( var j in this.shapes ){
                      for( var k in this.shapes[j].tracks ){
                        this.shapes[j].tracks[k].play( this.frame );
                      }
                    }
                  }
  };  
  
  // SHAPE //
  var Shape = function(name,objectRef,parent){
    this.name       = name;
    this.objectRef  = objectRef;
    this.parent     = parent;
    return this;
  };
  
  Shape.prototype = {
    tracks      : {},
    trackCount  : 0,
    track       : function(name,parent){
                    if(typeof props == 'String'){
                      return this.tracks[name];
                    }else{
                      this.trackCount ++;
                      return this.tracks[name] = new Track(name,this);
                    }
                  },
    timeline    : function(name,start,end,speed,loop){ return this.parent.parent.timeline.apply(this.parent.parent,[name,start,end,speed,loop,this.parent]); }, 
    shape       : function(name,objectRef){ return this.parent.shape.apply(this.parent,[name,objectRef,this.parent]); },
  };

  // TRACK //
  var Track = function(name,parent){
    this.name   = name;
    this.parent = parent;
    return this;
  };
  
  Track.prototype = {
    keys        : [],
    key         : function(frame,value,easing){
                    var thisKey   = this.keys[this.keys.length] = new Key(frame,value,easing,this), 
                        keyIndex  = [], keyStack=[];
                        
                    for(var i=0;i<this.keys.length;i++){
                      keyIndex[i]=this.keys[i].frame;
                    }
                    keyIndex.sort(sortNumber);
                    
                    for(var i=0;i<this.keys.length;i++){
                      for(var j=0;j<this.keys.length;j++){
                        if(keyIndex[i]==this.keys[j].frame){
                          keyStack[i]=this.keys[j];
                        }
                      }
                    }
                    this.keys=[];
                    for(var i=0, l=keyStack.length; i< l; i++){
                      this.keys[i] = keyStack[i];
                    }
                    return thisKey;
                  },
    timeline    : function(name,start,end,speed,loop){ return this.parent.parent.parent.timeline.apply(this.parent.parent.parent,[name,start,end,speed,loop,this.parent]); }, 
    shape       : function(name,objectRef){ return this.parent.parent.shape.apply(this.parent.parent,[name,objectRef,this.parent]); },
    track       : function(name){ return this.parent.track.apply(this.parent,[name,this.parent]); },
    play        : function( frame ){
                    var curKey, nextKey, val;
                    for(var i=0, l=this.keys.length; i<l; i++){
                      curKey = this.keys[i];
                      nextKey = this.keys[i+1];
                      if(nextKey === undefined && i+1 > l-1){
                        nextKey = this.keys[l-1];
                      }
                      if( frame >= curKey.frame && frame < nextKey.frame ){
                        val = engine(frame, this.name, curKey, nextKey);
                      }else if( frame >= nextKey.frame || frame === 0 ){
                        val = curKey.value;
                      }
                    }
                    this.parent.objectRef[this.name] = val;
                  }
  };

  // KEY //
  var Key = function(frame,value,easing,parent){
    this.frame = frame;
    this.value  = value;
    this.easing = easing;
    this.parent = parent;
    return this;
  };
  
  Key.prototype = {
    timeline    : function(name,start,end,speed,loop){ return this.parent.parent.parent.parent.timeline.apply(this.parent.parent.parent.parent,[name,start,end,speed,loop,this.parent]); }, 
    shape       : function(name,objectRef){ return this.parent.parent.parent.shape.apply(this.parent.parent.parent,[name,objectRef,this.parent]); },
    track       : function(name){ return this.parent.parent.track.apply(this.parent.parent,[name,this.parent]); },
    key         : function(frame,value,easing){ return this.parent.key.apply(this.parent,[frame,value,easing,this.parent]); }
  };
 
  window.burst = new Burst();
  
})();
