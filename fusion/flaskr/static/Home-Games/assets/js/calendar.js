
var month_olympic = [31,29,31,30,31,30,31,31,30,31,30,31];
var month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
var month_name = ["January","Febrary","March","April","May","June","July","Auguest","September","October","November","December"];

var my_date = {
  year : 2021,
  month: 3,
  date: 21,
  getFullYear: function(){
    return this.year;
  },
  getMonth: function(){
    return this.month;
  },
  getDate: function(){
    return this.date;
  }
}

var my_year = my_date.getFullYear();
var my_month = my_date.getMonth();
var my_day = my_date.getDate();

var holder = document.getElementById("days");
var prev = document.getElementById("prev");
var next = document.getElementById("next");

var prev_day = document.getElementById("prev-day");
var next_day = document.getElementById("next-day");

var prev_year = document.getElementById("prev_year");
var next_year = document.getElementById("next_year");

var current_date_show = $("#cur-date");

var ctitle = document.getElementById("calendar-title");
var cyear = document.getElementById("calendar-year");

var calendar_status = false;

// cal
function dayStart(month, year) {
  var tmpDate = new Date(year, month, 1);
  return (tmpDate.getDay());
}

//计算某年是不是闰年，通过求年份除以4的余数即可
function daysMonth(month, year) {
  var tmp = year % 4;
  if (tmp == 0) {
    return (month_olympic[month]);
  } else {
    return (month_normal[month]);
  }
}  

function refreshDate(){
  var str = "";
  var totalDay = daysMonth(my_month, my_year); //获取该月总天数
  var firstDay = dayStart(my_month, my_year); //获取该月第一天是星期几
  var myclass;
  var myStyle;// 
  for(var i=1; i<firstDay; i++){ 
    str += "<li></li>"; //为起始日之前的日期创建空白节点
  }
  for(var i=1; i<=totalDay; i++){


    if (i== my_day  && my_year==my_date.getFullYear() && my_month==my_date.getMonth()){
      myStyle = " style='background:#e6e6e6;'"
    }
    else{
      myStyle =""
    }

    myclass = " class=\'date\'"
    str += "<li"+myclass+myStyle+ ">"+i+"</li>"; //创建日期节点
  }

  holder.innerHTML = str; //设置日期显示
  ctitle.innerHTML = month_name[my_month]; //设置英文月份显示
  cyear.innerHTML = my_year; //设置年份显示

  current_date_show.html(my_year + " " + month_name[my_month] + " " + my_day);

}
refreshDate(); //执行该函数

$("ul#days").on("click","li",function(){      
  //只需要找到你点击的是哪个ul里面的就行,修改日期
  var cur = $(this)[0];
  cur.style.background ="#f3f3f3"  

  my_day = parseInt($(this).text());
  my_date.year = my_year;
  my_date.month = my_month;

  // tab 消失
  var cal_tab = document.getElementsByClassName("calendar-row")[0];
  cal_tab.style.display = "none";
  calendar_status = false;

  

  refreshDate();
});

prev_day.onclick = function(e){
    e.preventDefault();
    my_day--;
    if(my_day < 1){
        my_month --;
        
        if(my_month < 0){
            my_year--;
            my_month = 11;
          }
        my_day = daysMonth(my_month, my_year);
    }
    my_date.year = my_year;
    my_date.month = my_month;
    refreshDate();
  }
  
  next_day.onclick = function(e){
    e.preventDefault();

    my_day++;
    if(my_day > daysMonth(my_month, my_year)){
        my_month ++;
        if(my_month > 11){
            my_year++;
            my_month = 0;
        }
        my_day = 1;
    }
  my_date.year = my_year;
  my_date.month = my_month;
    refreshDate();
  }

prev.onclick = function(e){
  e.preventDefault();
  my_month--;
  if(my_month<0){
    my_year--;
    my_month = 11;
  }
  refreshDate();
}
next.onclick = function(e){
  e.preventDefault();
  my_month++;
  if(my_month>11){
    my_year++;
    my_month = 0;
  }
  refreshDate();
}
next_year.onclick = function(e){
  e.preventDefault();
  my_year++;
  refreshDate();
}
prev_year.onclick = function(e){
  e.preventDefault();
  my_year--;
  refreshDate();
}

//是否显示calendar-tab
$(".dropdown-icon-link").click(function(){
  var cal_tab = document.getElementsByClassName("calendar-row")[0];
  var cur_date = Date();
  console.log(cur_date)
  if(calendar_status == false){
    cal_tab.style.display = "block";
    calendar_status = true;
  }
  else{
    cal_tab.style.display = "none";
    calendar_status = false;
  }
});

