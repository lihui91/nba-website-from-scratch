
$(function(){
    
        $(".player-div").mouseover(function(){
            $(this).css({'cursor':"pointer"});
        });
    
        $(".player-div").mouseout(function(){
            $(this).css({'cursor':"default"});
        });
 
        $(".player-div").click(function(){
 
            var storeId=$(this).attr('value');
 
            $(location).attr('href', '#');
 
        });
             
 
    });