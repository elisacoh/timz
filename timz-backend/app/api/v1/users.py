from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User, Pro, Client
from app.schemas.users import UserCreate, UserResponse, ProResponse, ProBase, ClientBase, ClientResponse
from app.schemas.users import UserUpdate, ProUpdate, ClientUpdate
from app.dependencies.users import get_db
from uuid import UUID
from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Hash password before storing
def hash_password(password: str):
    return pwd_context.hash(password)


# *********************************************** USER *****************************************************************
# POST: Create a new user
@router.post("/", response_model=UserResponse)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        name=user_data.name,
        phone=user_data.phone,
        profile_image=user_data.profile_image,
        is_active=user_data.is_active,
        role=user_data.role if isinstance(user_data.role, list) else [user_data.role]  # Ensure list format
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    try:
        if "pro" in user_data.role:
            new_pro = Pro(user_id=new_user.id)
            db.add(new_pro)

        if "client" in user_data.role:
            new_client = Client(user_id=new_user.id)
            db.add(new_client)

        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

    return new_user


# GET: get list of all users
@router.get("/", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


# Get user by ID
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# PATCH: Update user
@router.patch("/{user_id}", response_model=UserResponse)
def update_user(user_id: UUID, user_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_data.dict(exclude_unset=True)  # Only update fields that are provided
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}", response_model=dict)
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete Pro profile if exists
    pro = db.query(Pro).filter(Pro.user_id == user_id).first()
    if pro:
        db.delete(pro)

    # Delete Client profile if exists
    client = db.query(Client).filter(Client.user_id == user_id).first()
    if client:
        db.delete(client)

    # Delete user
    db.delete(user)
    db.commit()

    return {"message": "User and all associated profiles deleted successfully"}



# *********************************************** PROS *****************************************************************

# GET: get list of all pros
@router.get("/pros/", response_model=list[ProResponse])
def get_all_pros(db: Session = Depends(get_db)):
    pros = db.query(Pro).all()
    return pros



# Get Pro profile by User ID
@router.get("/{user_id}/pro", response_model=ProResponse)
def get_pro_profile(user_id: UUID, db: Session = Depends(get_db)):
    pro = db.query(Pro).filter(Pro.user_id == user_id).first()
    if not pro:
        raise HTTPException(status_code=404, detail="Pro profile not found")
    return pro


# Register a user as a Pro
@router.post("/{user_id}/pro", response_model=ProResponse)
def create_pro_profile(user_id: UUID, pro_data: ProBase, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if "pro" in user.role:
        raise HTTPException(status_code=400, detail="User is already a Pro")

    new_pro = Pro(user_id=user_id, **pro_data.dict())
    db.add(new_pro)

    # Mark user as a pro
    user.role.append("pro")

    db.commit()
    db.refresh(new_pro)
    return new_pro


@router.patch("/{user_id}/pro", response_model=ProResponse)
def update_pro_profile(user_id: UUID, pro_data: ProUpdate, db: Session = Depends(get_db)):
    pro = db.query(Pro).filter(Pro.user_id == user_id).first()
    if not pro:
        raise HTTPException(status_code=404, detail="Pro profile not found")

    update_data = pro_data.dict(exclude_unset=True)  # Only update provided fields
    for key, value in update_data.items():
        setattr(pro, key, value)

    db.commit()
    db.refresh(pro)
    return pro

@router.delete("/{user_id}/pro", response_model=dict)
def delete_pro_profile(user_id: UUID, db: Session = Depends(get_db)):
    pro = db.query(Pro).filter(Pro.user_id == user_id).first()
    if not pro:
        raise HTTPException(status_code=404, detail="Pro profile not found")

    # Delete Pro profile
    db.delete(pro)

    # Check if the user is a client or not
    user = db.query(User).filter(User.id == user_id).first()
    if "pro" in user.role:
        user.role.remove("pro")  # Supprime "pro" de la liste des rôles

    if "client" not in user.role:  # If user is NOT a client, delete them too
        db.delete(user)
        db.commit()
        return{"message": "Pro profile deleted. User deleted too."}

    db.commit()
    return {"message": "Pro profile deleted. Client profile not deleted => User still exist."}



# *********************************************** CLIENTS **************************************************************

# GET: get list of all clients
@router.get("/clients/", response_model=list[ClientResponse])
def get_all_clients(db: Session = Depends(get_db)):
    clients = db.query(Client).all()
    return clients


# Get Client profile by User ID
@router.get("/{user_id}/client", response_model=ClientResponse)
def get_client_profile(user_id: UUID, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.user_id == user_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client profile not found")
    return client


# Register a user as a Client
@router.post("/{user_id}/client", response_model=ClientResponse)
def create_client_profile(user_id: UUID, db: Session = Depends(get_db), client_data: ClientBase = None):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if "client" in user.role:
        raise HTTPException(status_code=400, detail="User is already a Client")

    new_client = Client(user_id=user_id)
    db.add(new_client)

    # Mark user as a client
    user.role.add("client")

    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/client", response_model=ProResponse)
def update_client_profile(user_id: UUID, client_data: ClientUpdate, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.user_id == user_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client profile not found")

    update_data = client_data.dict(exclude_unset=True)  # Only update provided fields
    for key, value in update_data.items():
        setattr(client, key, value)

    db.commit()
    db.refresh(client)
    return client

@router.delete("/{user_id}/client", response_model=dict)
def delete_client_profile(user_id: UUID, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.user_id == user_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client profile not found")

    # Delete Client profile
    db.delete(client)

    # Check if the user is a pro or not
    user = db.query(User).filter(User.id == user_id).first()
    if "client" in user.role:
        user.role.remove("client")  # Supprime "pro" de la liste des rôles

    if "pro" not in user.role:  # If user is NOT a pro, delete them too
        db.delete(user)
        db.commit()
        return {"message": "Client profile deleted. User deleted too."}

    db.commit()
    return {"message": "Client profile deleted. Pro profile not deleted => User still exist."}

