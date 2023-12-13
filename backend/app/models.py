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
    connection_string: Mapped[str] = mapped_column(String(150),nullable=True,unique=True)
    children: Mapped[List["Snippet"]] = relationship()
    creator: Mapped[int] = mapped_column(ForeignKey("user.id"))
    users: Mapped[List[User]] = relationship(secondary=project_user)

class Message(db.Model):
    __tablename__ = "message"
    id = db.Column(db.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(256))
    snippet_id: Mapped[int] = mapped_column(ForeignKey("snippets.id"))
    message: Mapped[str] = mapped_column(String(256))
    
 
class Advertisment(db.Model):

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'owner': self.owner,
            'city': self.city,
            'street': self.street,
            'address_number': self.address_number
            # Přidejte další sloupce podle potřeby
        }
    __tablename__ = "advertisment"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50),nullable =False)
    description = db.Column(db.String(50))
    price = db.Column(db.Float)
    owner = db.Column(db.Integer,db.ForeignKey('user.id'))
    city = db.Column(db.String(50))
    street = db.Column(db.String(50))
    address_number = db.Column(db.Integer)
