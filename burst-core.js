/*
  burst-engine-core -f1lt3r
    track :: name,start,end,speed,loop
    shape :: name,objectRef
    prop  :: name
    key   :: frame,value,easing
*/    
(function(){  
  
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
    inBounce      : function(x,t,b,c,d){ return c - ease['easeOutBounce']( x, d-t, 0, c, d) + b; },
    outBounce     : function(x,t,b,c,d){ if((t/=d) < (1/2.75)){ return c*(7.5625*t*t) + b; } else if (t < (2/2.75)) { return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b; } else if (t < (2.5/2.75)) { return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b; } else { return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b; } },
    inOutBounce   : function(x,t,b,c,d){ if(t < d/2) return ease['easeInBounce'](x, t*2, 0, c, d) * .5 + b; return ease['easeOutBounce'](x, t*2-d, 0, c, d) * .5 + c*.5 + b; }
  };

  var engine = function engine(object,frame,prop,curKey,nextKey){
    if( frame >= curKey.frame && frame<nextKey.frame ){
      var e=curKey.easing;
      var x=0;
      var t=frame-curKey.frame;
      var b=curKey.value;
      var c=nextKey.value-curKey.value;
      var d=nextKey.frame-curKey.frame;
      prop=ease[e](x,t,b,c,d);
    }else if(frame>=nextKey.frame||frame==0){
      prop=curKey.value;
    }
  };
     
  // BURST //
  var Burst = function(){
    this.name = 'Burst Instance';
  };
     
  Burst.prototype = {
    timelines     : {},
    timelineCount : 0,
    timeline      : function(name,start,end,speed,loop){
                      if(typeof name == 'String'){
                        return this.timelines[name];
                      }else{
                        this.timelineCount ++;
                        return this.timelines[name] = new Timeline(name,start,end,speed,loop,this);
                      }
                    },

    loaded : {},
    
    load: function( name ){
      return this.loaded[name] || (function(){
        for( i in this.timelines ){
          if( this.timelines[i] ){
            return this.loaded[i] = this.timelines[i];
          }else{
            this.debug(1, name);
            return this;
          }
        }
      }).call(this);
    },
    
    frame: function(){
      for( var i in this.playing ){
        console.log( i );
      }
    }
                  
  };  
  
  // TIMELINE //
  Timeline = function(name,start,end,speed,loop,parent){
    this.name   = name;
    this.start  = start;
    this.end    = end;
    this.speed  = speed;
    this.loop   = loop;
    this.parent = parent;
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
                  }
  };
  
  // SHAPE //
  Shape = function(name,objectRef,parent){
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
  Track = function(name,parent){
    this.name   = name;
    this.parent = parent;
    return this;
  };
  
  Track.prototype = {
    keys        : [],
    key         : function(frame,value,easing){
                    if(typeof props == 'Number'){
                      return this.keys[frame];
                    }else{
                      return this.keys[frame] = new Key(frame,value,easing,this);
                    }
                  },
    timeline    : function(name,start,end,speed,loop){ return this.parent.parent.parent.timeline.apply(this.parent.parent.parent,[name,start,end,speed,loop,this.parent]); }, 
    shape       : function(name,objectRef){ return this.parent.parent.shape.apply(this.parent.parent,[name,objectRef,this.parent]); },
    track       : function(name){ return this.parent.track.apply(this.parent,[name,this.parent]); },
  };

  // KEY //
  Key = function(frame,value,easing,parent){
    this.name   = name;
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


  
  this.burst = new Burst();
  
})();
