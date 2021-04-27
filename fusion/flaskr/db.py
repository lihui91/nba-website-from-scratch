'''
load in database
'''

import click
from flask import current_app, g
from flask.cli import with_appcontext

from flask_sqlalchemy import SQLAlchemy
import pymysql

from sqlalchemy import create_engine
from sqlalchemy import select
from sqlalchemy import Table, Column, Integer, String
from sqlalchemy import MetaData

metadata = MetaData()


def get_db():
    """
        brief@ Get db connector
    """
    if 'db' not in g:
        g.db = SQLAlchemy(current_app)
        g.db.reflect()
        g.all_table = {table_obj.name: table_obj for table_obj in g.db.get_tables_for_bind()}

    return g.db

def get_all_table():
    """
        brief@ Get all tables in db
        usage@ i.e.
            all_table[__table__name__].c. (stands for column!) -> with the column attri~ 
                use common to connect all the info in one unit!
            posts = db.session.query(all_table["all_team_basic"].c.city, all_table["all_team_basic"].c.abbr).all() 
    """
    if 'all_table' not in g:
        # update table names!
        g.db = SQLAlchemy(current_app)
        g.db.reflect()
        g.all_table = {table_obj.name: table_obj for table_obj in g.db.get_tables_for_bind()}

    return g.all_table

def close_db(e=None):
    db = g.pop('db', None)
    all_table = g.pop('all_table', None)

def init_db():
    db = get_db()

@click.command('init-db')
@with_appcontext
def init_db_command():
    """Load tables from my database!"""
    init_db()
    click.echo('Initialized the database.')
    
def init_app(app):
    app.cli.add_command(init_db_command)

    