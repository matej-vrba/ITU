from app import db
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy import String

advertisment_category = db.Table('advertisment_category',
                    db.Column('advertisment_id', db.Integer, db.ForeignKey('advertisment.id')),
                    db.Column('category_id', db.Integer, db.ForeignKey('category.id'))
                    )

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(50),nullable =False,unique=True)
    password = db.Column(db.String(50),nullable =False,unique=True)
    advertisments = db.relationship('Advertisment',backref="user",cascade='all, delete')

class Snippet(db.Model):
    __tablename__ = "snippets"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150))


class Category(db.Model):
    __tablename__ = "category"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256))
    advertisments = db.relationship('Advertisment',secondary=advertisment_category,backref='categories')


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
