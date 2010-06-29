(function(){

  var header = "Burst Error: ";
  
  this.burst.debug = function( code, context ){
    
    function log( message ){

      console.info( message );

    };
    
    codes = {

      1: 'timeline "' + context + '" does not exist. '

    }

    log( header + codes[ code ] );
         
  };
  
})();
