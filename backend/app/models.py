from app import db
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import String, UnicodeText, ForeignKey
from typing import List



class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    created_projects: Mapped[List["Project"]] = relationship()

class Snippet(db.Model):
    __tablename__ = "snippets"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150))
    created_at = db.Column(db.Date())
    code = db.Column(db.UnicodeText())
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))

class Project(db.Model):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at = db.Column(db.Date())
    children: Mapped[List["Snippet"]] = relationship()
    creator: Mapped[int] = mapped_column(ForeignKey("user.id"))



