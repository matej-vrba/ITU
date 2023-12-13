from app import db, create_app
from app.models import User,Advertisment,Snippet,Project,Message
from datetime import datetime

app = create_app()

with app.app_context():
    # Create the tables
    db.create_all()

    user_1 = User()
    db.session.add(user_1)
    db.session.commit()

    db.session.add(Project(created_at=datetime.today(),creator=user_1.id))

    db.session.add(Snippet(title="A snippet", created_at=datetime.today(), code="""//sample code
#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("Hello world\\n")
    return 0;
}""",
                           project_id = 1
                           ))
    db.session.add(Snippet(title="Another snippet", created_at=datetime.today(), code="""//Sample code
#include <iostream>

int main(int argc, char *argv[]) {
	std::cout << "Hello world" << std::endl;
    return 0;
}""",
                           project_id = 1
                           ))
    db.session.add(Snippet(title="Guess what!!! another snippet", created_at=datetime.today(), code="""//Sample code
fn main() {
    println!("Hello World!");
}
    """,

                           project_id = 1
                           ))
    
    db.session.add(Message(name="Jiří", snippet_id=1, message="Zpráva"));
    
    

    #user0 = User(username="xname00", password="heslo00", email="xlog00@email.cz,")
    #user1 = User(username="xname01", password="heslo01", email="xlog01@email.cz,")
    #user2 = User(username="xname02", password="heslo02", email="xlog02@email.cz,")
    #user3 = User(username="xname03", password="heslo03", email="xlog03@email.cz,")
    #user4 = User(username="xname04", password="heslo04", email="xlog04@email.cz,")
    #user5 = User(username="xname05", password="heslo05", email="xlog05@email.cz,")

    #category0 = Category(name="Elektro")
    #category1 = Category(name="Domacnost")
    #category2 = Category(name="Automobily")
    #category3 = Category(name="Kosmetika")
    #category4 = Category(name="Obleceni")
    #category5 = Category(name="Sport")
    #category6 = Category(name="Zvirata")

    #db.session.add(user0)
    #db.session.add(user1)
    #db.session.add(user2)
    #db.session.add(user3)
    #db.session.add(user4)
    #db.session.add(user5)

    #db.session.add(category0)
    #db.session.add(category1)
    #db.session.add(category2)
    #db.session.add(category3)
    #db.session.add(category4)
    #db.session.add(category5)
    #db.session.add(category6)

    #db.session.commit()

    #advertisment0 = Advertisment(title = "Xiami redmi",description = "Super dobtej telefon",price = 4000,owner = user0.id)
    #advertisment0.categories.append(category0)
    #db.session.add(advertisment0)

    #advertisment1 = Advertisment(title = "Ford focus",description = "Super dobtej ford",price = 100_000,owner = user0.id)
    #advertisment1.categories.append(category2)
    #db.session.add(advertisment1)

    #advertisment2 = Advertisment(title = "Vysavas toshiba",description = "Super dobtej vysavac",price = 1999.99,owner = user1.id)
    #advertisment2.categories.extend([category0,category1])
    #db.session.add(advertisment2)

    #advertisment3 = Advertisment(title = "Slon",description = "Super dobtej slon",price = 10_000,owner = user3.id)
    #advertisment3.categories.append(category6)
    #db.session.add(advertisment3)

    #advertisment4 = Advertisment(title = "Rtenka",description = "Super dobtej rtenka",price = 99.99,owner = user2.id)
    #advertisment4.categories.append(category3)
    #db.session.add(advertisment4)

    #advertisment5 = Advertisment(title = "Bezecka mikina",description = "Super dobtej mikin",price = 550,owner = user4.id)
    #advertisment5.categories.extend([category4,category5])
    #db.session.add(advertisment5)

    db.session.commit()

