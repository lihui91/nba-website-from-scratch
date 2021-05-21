"""
'db.session.query' stands for query language for SQL
can use 'filter' on the original tables!

"""


from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, current_app
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db, get_all_table
from sqlalchemy import text
import math

def error_debug(input):
    """
    brief@ Output red as warnings!
    """
    print("\033[1;31;40m{}\033[0m".format(input))  


player_status_info_color = {
"1610612762":	"#002b5c",#jazz
"1610612749":	"#00471b",#bucks
"1610612740":	"#002b5c",#pelicans
"1610612763":	"#5d76a9",#grizzlies
"1610612752":	"#006bb6",#knicks
"1610612760":	"#007ac1",#thunder
"1610612753":	"#0077c0",#magic
"1610612737":	"#e03a3e",#hawks
"1610612755":	"#006bb6",#sixers
"1610612764":	"#002b5c",#wizards
"1610612743":	"#0e2240",#nuggets
"1610612741":	"#ce1141",#bulls
"1610612746":	"#008348",#clippers
"1610612747":	"#552583",#lakers
"1610612751":	"#000",#nets
"1610612738":	"#008348",#celtics
"1610612757":	"#051c2d",#blazers
"1610612759":	"#051c2d",#spurs
"1610612742":	"#0053bc",#mavericks
"1610612766":	"#00788c",#hornets
"1610612756":	"#1d1160",#suns
"1610612744":	"#006bb6",#warriors
"1610612750":	"#0c2340",#timberwolves
"1610612765":	"#1d428a",#pistons
"1610612754":	"#002d62",#pacers
"1610612745":	"#ce1141",#rockets
"1610612739":	"#6f263d",#cavaliers
"1610612748":	"#98002e",#heat
"1610612761":	"#000",#raptors
"1610612758":	"#5a2d81" #kings
}

bp = Blueprint('blog', __name__)



@bp.route('/', methods = ['GET', 'POST'])
def index():
    """
        brief@ Put all the player info into the HTML from the DB.
    """
    db = get_db()
    all_table = get_all_table()
    # Get all team name
    all_team_name = db.session.query(all_table["all_team_basic"].c.nameEn).order_by(text('nameEn asc')).all()
    # Get all country name
    all_country_name = db.session.query(all_table["players_basic"].c.countryEn).distinct().order_by(text('countryEn asc')).all()

    # Add paginate with on the button: ( strange! can't use onclick attri? )
    page = request.args.get('page', 1, type=int)
    player_name_fc = request.args.get('player_', 'All Players', type=str)
    player_team = request.args.get('team_', 'All Teams', type=str)
    player_position = request.args.get('position_', "All Positions", type=str)
    player_country = request.args.get('country_', 'All Countries', type=str)

    player_full_name = request.form.get('playerfull_')
    if player_full_name == None:
        player_full_name = ""
    # filter in name    
    if player_name_fc == "All Players": 
        posts = db.session.query(all_table["players_basic"]).order_by(text('lastNameEn asc'))
    else :
        posts = db.session.query(all_table["players_basic"]).filter(all_table["players_basic"].c.lastNameEn.like("{}%".format(player_name_fc))).order_by(text('lastNameEn asc'))

    # filter in search box
    if player_full_name != "":
        posts = db.session.query(all_table["players_basic"]).filter(all_table["players_basic"].c.code.like("%{}%".format(player_full_name))).order_by(text('lastNameEn asc'))

    print(player_full_name)
    # filter in team    
    if player_team != "All Teams": 
        team_id =  db.session.query(all_table["all_team_basic"]).filter_by(nameEn = player_team).all()
        # if the answer is an empty set!
        print(team_id[0])
        cur_team_id = team_id[0][-6] 
        if len(team_id) != 0:
            posts = posts.filter_by(teamId = cur_team_id)

    # filter in position    
    if player_position != "All Positions": 
        posts = posts.filter(all_table["players_basic"].c.position.like("%{}%".format(player_position)))

    # filter in country
    if player_country != "All Countries":
        posts = posts.filter_by(countryEn = player_country)
    
    # player list in every page
    posts_paged = posts.paginate(page, current_app.config['POSTS_PER_PAGE'], False)

    # still contain all the filter info 
    next_url = url_for('blog.index', page=posts_paged.next_num,
                                     team_ = player_team, 
                                     player_ = player_name_fc, 
                                     position_ = player_position,
                                     country_ = player_country,
                                     playerfull_ = player_full_name) \
        if posts_paged.has_next else None

    prev_url = url_for('blog.index', page=posts_paged.prev_num,
                                     team_ = player_team, 
                                     player_ = player_name_fc, 
                                     position_ = player_position,
                                     country_ = player_country,
                                     playerfull_ = player_full_name) \
        if posts_paged.has_prev else None

    # count current items and total pages
    total_player_num = posts.count() 
    total_pages = math.ceil(total_player_num * 1.0 / current_app.config['POSTS_PER_PAGE'])

    return render_template('blog/Home-Players.html', # all_player_brief
                            posts=posts_paged.items, 
                            prev_url = prev_url, 
                            next_url = next_url,
                            page = page,
                            player_name_fc = player_name_fc,
                            player_full_name = player_full_name,
                            player_team = player_team,
                            player_position = player_position,
                            player_country = player_country,
                            total_player_num = total_player_num,
                            total_pages = total_pages,
                            all_team_name = all_team_name,
                            all_country_name = all_country_name)


# @bp.route('/create', methods=('GET', 'POST'))
# @login_required
# def create():
#     if request.method == 'POST':
#         title = request.form['title']
#         body = request.form['body']
#         error = None

#         if not title:
#             error = 'Title is required.'

#         if error is not None:
#             flash(error)
#         else:
#             db = get_db()
#             db.execute(
#                 'INSERT INTO post (title, body, author_id)'
#                 ' VALUES (?, ?, ?)',
#                 (title, body, g.user['id'])
#             )
#             db.commit()
#             return redirect(url_for('blog.index'))

#     return render_template('blog/create.html')


def get_player_info(id, table_name = "", check_author=True):
    """
        brief@ get certain player by playerid
    """
    db = get_db()
    all_table = get_all_table()
    print("\033[1;31;40m{}\033[0m".format(id))  
    cur_player = db.session.query(all_table[table_name]).filter_by(playerId = id).all()
    print(cur_player)
    if cur_player is None:
        abort(404, "Play id {0} doesn't exist.".format(id))

    return cur_player

def get_team_info(id, table_name = "", check_author=True):
    """
        brief@ get certain player by playerid
    """
    db = get_db()
    all_table = get_all_table()
    print("\033[1;31;40m{}\033[0m".format(id))  
    cur_player = db.session.query(all_table[table_name]).filter_by(id = id).all()
    print(cur_player)
    if cur_player is None:
        abort(404, "Play id {0} doesn't exist.".format(id))

    return cur_player


# @bp.route('/<int:id>/update', methods=('GET', 'POST'))
@bp.route('/<int:id>/update', methods=('GET', 'POST'))
def update(id):
    brief_info = get_player_info(id, "players_basic")
    aver_stastic = get_player_info(id, "players_statAverage")
    # print("['teamId']")
    # print(type(brief_info[0]))
    team_id = brief_info[0][-1]
    team_info = get_team_info(team_id, "all_team_basic") # brief_info[0]['teamId']

    """ Note: it is selected as a list! """
    print(player_status_info_color[team_id])
    

    bg_color = player_status_info_color[team_id]

    return render_template('blog/Home-Player-Certain.html', # certain_player.html', # 
                            brief_info = brief_info[0], 
                            aver_stastic = aver_stastic[0],
                            team_info = team_info[0], 
                            bg_color = bg_color
                            )


# @bp.route('/<int:id>/delete', methods=('POST',))
# @login_required
# def delete(id):
#     get_post(id)
#     db = get_db()
#     db.execute('DELETE FROM post WHERE id = ?', (id,))
#     db.commit()
#     return redirect(url_for('blog.index'))