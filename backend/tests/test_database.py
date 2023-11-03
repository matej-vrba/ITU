from app.models import User,Advertisment,Category
from app import db

def test_user_update( app):
    # Insert a user into the database
    user = User(username="xname01", password="hesloxdd", email="xlog00@email.cz,")
    db.session.add(user)
    db.session.commit()

    # Retrieve the user from the database and update their information
    retrieved_user = User.query.filter_by(username="xname01").first()
    assert retrieved_user is not None
    retrieved_user.username = "new_username"
    db.session.commit()

    # Retrieve the user again to verify the update
    updated_user = User.query.filter_by(username="new_username").first()
    assert updated_user is not None
    assert updated_user.username == "new_username"

def test_user_delete(client, app):
    # Insert a user into the database
    user = User(username="xname00", password="hesloxdd", email="xlog00@email.cz,")

    db.session.add(user)
    db.session.commit()

    # Delete the user from the database
    user_to_delete = User.query.filter_by(username="xname00").first()
    assert user_to_delete is not None
    db.session.delete(user_to_delete)
    db.session.commit()

    # Attempt to retrieve the user after deletion
    deleted_user = User.query.filter_by(username="xname00").first()
    assert deleted_user is None  # The user should not be found

def test_category_insert_delete(client,app):

    # Insert a system into the database
    category = Category(name="Elektronika")    
    db.session.add(category)
    db.session.commit()

    retrieved_system = Category.query.filter_by(name="Elektronika").first()
    assert retrieved_system is not None
    assert retrieved_system.name == "Elektronika"

    db.session.delete(retrieved_system)
    db.session.commit()

    deleted_catefory = Category.query.filter_by(name="Elektronika").first()
    assert deleted_catefory is None  # The user should not be found

def test_addvertisment_insert(client,app):
    user = User(username="xname00", password="hesloxdd", email="xlog00@email.cz,")
    db.session.add(user)
    db.session.commit()

    ad = Advertisment(title="telefon0",owner=user.id,description="xoxooxoxox",price=420.69)
    db.session.add(ad)
    db.session.commit()

    retrieved_user = User.query.filter_by(username="xname00").first()
    retrieved_ad = Advertisment.query.filter_by(title="telefon0").first()
    assert retrieved_ad.owner == retrieved_user.id
    assert retrieved_user.advertisments[0] == retrieved_ad


def test_category_advertisment(client,app):
    user = User(username="xname00", password="hesloxdd", email="xlog00@email.cz,")
    db.session.add(user)
    db.session.commit()

    category1 = Category(name="category1")    
    category2 = Category(name="category2")    
    db.session.add(category1)
    db.session.add(category2)
    db.session.commit()

    
    
    ad1 = Advertisment(title="telefon1",owner=user.id,description="xoxooxoxox",price=420.69)
    ad2 = Advertisment(title="telefon2",owner=user.id,description="sdasdaasas",price=55550)

    db.session.add(ad1)
    db.session.add(ad2)
    db.session.commit()

    ad1.categories.append(category1)
    ad1.categories.append(category2)
    ad2.categories.append(category1)

    db.session.commit()

    retrieved_ad1 = Advertisment.query.filter_by(title="telefon1").first()
    retrieved_ad2 = Advertisment.query.filter_by(title="telefon2").first()

    assert category1 in retrieved_ad1.categories
    assert category2 in retrieved_ad1.categories 
    assert category1 in retrieved_ad2.categories 


    retrieved_category1 = Category.query.filter_by(name="category1").first()
    retrieved_category2 = Category.query.filter_by(name="category2").first() 
    assert ad1 in retrieved_category1.advertisments
    assert ad2 in retrieved_category1.advertisments
    assert ad1 in retrieved_category2.advertisments

