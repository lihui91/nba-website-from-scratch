# 篮球数据库的数据获取及可视化图表部分

## 1. 文件目录一览
- csv : 爬下来的源文件
- getdata.ipynb : 爬取过程
- getData.py : opencv画图过程



## 2. 数据库数据获取
详见getdata.ipynb，主要过程如下：

```python
# 找到待爬取的url
url = "https://china.nba.com/static/data/league/teamstats_All_All_2020_2.json"
# 响应爬取
response = requests.get(url, timeout=5) #headers=headers,
# 文件解析
data = response.json()
teams = data['payload']['teams']
# 添加一些行或列
# 打包成pd
all_team = pd.DataFrame(teams)
#保存为cvs到相应目录
```



## 3. 图表可视化

TODO : （pychart？）

1. **球员场均基本数据可视化：**

   以joel-embiid为例：

   **画出一个个人数据和联盟数据的对比图。**（可以柱状也可以星状图

![image-20210426094624203](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426094624203.png)

（https://china.nba.com/players/vs/#!/joel_embiid/?）

![image-20210426095733826](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426095733826.png)

(https://blog.csdn.net/ninewolfyan/article/details/83786205?)

**数据检索流程：**

先到`players_basic`中找到`球员id`

![image-20210426095019132](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426095019132.png)

然后找到`player`/`all_player_statAverage.csv`

![image-20210426095050052](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426095050052.png)

你可能需要用到的数据头：

> assistsPg(场均助攻)
>
> blocksPg(场均盖帽)
>
> pointsPg(场均得分),
>
> rebsPg,(场均篮板),
>
> stealsPg(场均抢断),
>
> fgpct(场均投篮命中率%)，
>
> ftpct(场均罚球命中率%)，
>
> tppct(场均三分命中率%)

2. **球员单场投篮热点图可视化**

参考`getData.py`, 选一个就行了吧~

![image-20210426100100400](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426100100400.png)

![image-20210426100113068](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426100113068.png)

![image-20210426100037952](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426100037952.png)

![image-20210426100049418](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426100049418.png)

https://www.nba.com/stats/events/?flag=3&CFID=33&CFPARAMS=2020-21&PlayerID=2544&ContextMeasure=FGA&Season=2020-21&section=player&sct=hex

