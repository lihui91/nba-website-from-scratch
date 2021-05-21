$(function(){
//鼠标悬停背景色
	var col="";
    var col1="";
    var col2="";
    //$("#tb tr")--选择id为tb的table，再选择该table的行tr
    // mouseover--鼠标放上去的事件（悬停）
    //$("#tb tr").mouseover();--给tb的行tr添加鼠标悬停事件
    //slice(1)选择从第二行开始（标题行不需要悬停变色）
    $("#tb tr").slice(0).mouseover(function(){
    	col=$(this).css("background-color");//获取初始背景色
        col1=$(this).css("border-top");
        col2=$(this).css("border-bottom");
        $(this).css({'background-color': "#CEE1F7",'border-top':"solid 1px #0000ff",'border-bottom':"solid 1px #0000ff"});//添加背景色，$(this)表示当前选择的元素。
        
    });
    // mouseout--鼠标离开的事件
    $("#tb tr").slice(0).mouseout(function(){
        $(this).css("background-color",col);//设置成初始背景色
        $(this).css("border-top",col1);
        $(this).css("border-bottom",col2);
    });
});