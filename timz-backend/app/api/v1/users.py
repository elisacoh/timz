from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.dependencies.auth import require_roles, get_current_user
from app.models.user import User, ProfileClient, ProfilePro
from app.schemas.users import Address, UserRole, AddRoleRequest, RoleDeleteRequest, UserDetailsOut




router = APIRouter()

@router.post("/{user_id}/deactivate", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_user(user_id: UUID, db: Session = Depends(get_db), current_admin: User = Depends(require_roles(["admin"]))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    return


@router.post("/{user_id}/add-role", status_code=200)
def add_role(user_id: UUID, data: AddRoleRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.role in user.roles:
        raise HTTPException(status_code=400, detail="User already has this role")

    user.roles.append(data.role)

    if data.role == UserRole.pro:
        if not data.business_name:
            raise HTTPException(status_code=400, detail="Missing business_name for pro")
        profile = ProfilePro(
            user_id=user.id,
            business_name=data.business_name,
            website=data.website,
            address=data.address.dict() if data.address else None
        )
        db.add(profile)

    elif data.role == UserRole.client:
        profile = ProfileClient(
            user_id=user.id,
            phone=user.phone,
            address=data.address.dict() if data.address else None
        )
        db.add(profile)

    db.commit()
    return {"message": "Role added"}

# peut etre devoir le changer en post ou patch si bug mobile delete dont accept body
@router.delete("/{user_id}/role", status_code=204)
def delete_role(
    user_id: UUID,
    data: RoleDeleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    is_self = current_user.id == user.id
    is_admin = "admin" in current_user.roles
    if not (is_self or is_admin):
        raise HTTPException(status_code=403, detail="Forbidden")

    if data.role not in user.roles:
        raise HTTPException(status_code=400, detail="Role not present on this user")

    # Supprimer le profil concerné
    if data.role == UserRole.pro:
        db.query(ProfilePro).filter(ProfilePro.user_id == user.id).delete()
    elif data.role == UserRole.client:
        db.query(ProfileClient).filter(ProfileClient.user_id == user.id).delete()
    elif data.role == UserRole.admin:
        pass  # Pas de table associée pr l'instant, on supprime juste le rôle

    # Mettre à jour la liste des rôles
    user.roles = [r for r in user.roles if r != data.role]

    # Si plus aucun rôle → supprimer entièrement le compte
    if not user.roles:
        db.delete(user)

    db.commit()
    return

from fastapi import Query
from typing import Optional

@router.get("/", response_model=List[UserDetailsOut])
def list_users(
    role: Optional[str] = Query(None, description="Filter by role (client, pro, admin)"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_roles(["admin"]))
):
    query = db.query(User)
    if role:
        query = query.filter(User.roles.any(role))  # PostgreSQL ARRAY filterin, fonctionne uniquement ac ARRAY(String) et pas JSONB.
    return query.all()


@router.get("/{user_id}", response_model=UserDetailsOut)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_roles(["admin"]))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# # *********************************************** USER *****************************************************************


# # PATCH: Update user
# @router.patch("/{user_id}", response_model=UserResponse)
# def update_user(user_id: UUID, user_data: UserUpdate, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#
#     update_data = user_data.dict(exclude_unset=True)  # Only update fields that are provided
#     for key, value in update_data.items():
#         setattr(user, key, value)
#
#     db.commit()
#     db.refresh(user)
#     return user
#

#

#
#
