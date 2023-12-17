from app import db
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import String, UnicodeText, ForeignKey
from typing import List
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Table
from sqlalchemy import Column



project_user = Table(
    "project_user",
    db.Model.metadata,
    Column("project_id", ForeignKey("projects.id")),
    Column("user_id", ForeignKey("user.id")),
)

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    created_projects: Mapped[List["Project"]] = relationship()
    name: Mapped[str] = mapped_column(String(150),nullable=True)


class Snippet(db.Model):
    __tablename__ = "snippets"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150))
    created_at = db.Column(db.Date())
    lang: Mapped[str] = mapped_column(String(20), nullable=True)
    code = db.Column(db.UnicodeText())
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))

class Project(db.Model):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at = db.Column(db.Date())
    name: Mapped[str] = mapped_column(String(150),nullable=True)  
    connection_string: Mapped[str] = mapped_column(String(150),nullable=True,unique=True)
    children: Mapped[List["Snippet"]] = relationship()
    creator: Mapped[int] = mapped_column(ForeignKey("user.id"))
    users: Mapped[List[User]] = relationship(secondary=project_user)

#   Třída sqlAlchemy pro ukládání zpráv
#   
#   Autor: Martin Soukup
#   Login: xsouku15
class Message(db.Model):
    __tablename__ = "message"
    id = db.Column(db.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(256))
    snippet_id: Mapped[int] = mapped_column(ForeignKey("snippets.id"))
    message: Mapped[str] = mapped_column(String(256))

#   Třída sqlAlchemy pro ukládání hlasování
#   
#   Autor: Martin Soukup
#   Login: xsouku15   
class Vote(db.Model):
    __tablename__ = "vote"
    id = db.Column(db.Integer, primary_key=True)
    vote_title: Mapped[str] = mapped_column(String(256))
    code_line = db.Column(db.Integer, nullable=True)
    created_by: Mapped[int] = mapped_column(ForeignKey("user.id"))
    snippet_id: Mapped[int] = mapped_column(ForeignKey("snippets.id"))
    active = db.Column(db.Boolean, default=True, nullable=False)

#   Třída sqlAlchemy pro ukládání hlasů uživatelů
#   
#   Autor: Martin Soukup
#   Login: xsouku15
class Vote_result(db.Model):
    __tablename__ = "vote_results"
    id = db.Column(db.Integer, primary_key=True)
    vote_id: Mapped[int] = mapped_column(ForeignKey("vote.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    vote_state = db.Column(db.Boolean)
    
