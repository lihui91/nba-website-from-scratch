
function updateDropdown(event){
    //进行查询操作
        var searchRootNode = this.parentNode.parentNode.parentNode;
        // no-choice prompt
        var prompt = searchRootNode.getElementsByClassName("highlight-blue")[0];
        
        let value = this.value.toUpperCase();
        var hahah = searchRootNode.getElementsByClassName("dropdown-item");//document.getElementById("player-name-dropdown").getElementsByClassName("dropdown-item");

        let cnt = 0;
        let haha_len = 0;
        for (key in hahah){
            var element = hahah[key];
            
            if(key == 0)
                continue;
            if(element.text == undefined)
                break;
            cnt ++;
            haha_len ++;
            if(!element.text.toUpperCase().includes(value)){
                element.style.display = "none";
            }
            else{
                element.style.display = "block";
                cnt --;
            }            
        }

        if(cnt >= haha_len){
            prompt.style.display = "block";
        }
        else{
            prompt.style.display = "none";
        }
    }

$(".country_name_search").bind("input propertychange",updateDropdown);
$(".player_name_search").bind("input propertychange",updateDropdown);
$(".player_teamname_search").bind("input propertychange",updateDropdown);

