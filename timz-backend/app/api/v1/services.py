from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.service import Service, ServiceGroup, Category
from app.schemas.service import ServiceCreate, ServiceOut, ServiceGroupOut, ServiceGroupCreate, CategoryOut, CategoryCreate

router = APIRouter()

@router.post("/", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(
        data: ServiceCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if "pro" not in current_user.roles:
        raise HTTPException(status_code=403, detail="Only pros can create services")

    if data.pricing_type in ("fixed", "starting_from"):
        if data.base_price is None or data.duration is None:
            raise HTTPException(status_code=400, detail="A base price and duration are required for fixed/starting_from price")

    service = Service(pro_id=current_user.id, **data.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)

    return service

@router.get("/", response_model=List[ServiceOut])
def get_my_services(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Service).filter(Service.pro_id == current_user.id).order_by(Service.created_at.desc()).all()

@router.get("/{service_id}", response_model=ServiceOut)
def get_service(
  service_id: UUID,
  data: ServiceCreate,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
    service = db.query(Service).filter(Service.id == service_id, Service.pro_id == current_user.id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found for this id")

    for key, value in data.model_dump().items():
        setattr(service, key, value)

    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
        service_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    service = db.query(Service).filter(Service.id == service_id, Service.pro_id == current_user.id).first()
    if not service:
            raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()

@router.post("/service-groups", response_model=ServiceGroupOut, status_code=status.HTTP_201_CREATED)
def create_service_group(
        data: ServiceGroupCreate, db: Session = Depends(get_db), current_user: User=Depends(get_current_user)
):
    if "pro" not in current_user.roles:
        raise HTTPException(status_code=403, detail="Only pros can create service groups")

    group = ServiceGroup(
        pro_id=current_user.id,
        name=data.name,
        position=data.position or 0
    )

    db.add(group)
    db.commit()
    db.refresh(group)
    return group

@router.get("/service-groups", response_model=list[ServiceGroupOut])
def get_my_groups(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ServiceGroup).filter(ServiceGroup.pro_id == current_user.id).order_by(ServiceGroup.position).all()

@router.get("/public", response_model=List[ServiceOut])
def list_public_services(
        category_id: Optional[UUID] = Query(None),
        pro_id: Optional[UUID] = Query(None),
        service_group_id: Optional[UUID] = Query(None),
        db: Session = Depends(get_db)
):
    query = db.query(Service).filter(Service.is_active == True, Service.is_public == True)
    if category_id:
        query = query.filter(Service.category_id == category_id)
    if pro_id:
        query = query.filter(Service.pro_id == pro_id)
    if service_group_id:
        query = query.filter(Service.service_group_id == service_group_id)

    return query.order_by(Service.created_at.desc()).all()

@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(data: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if "admin" not in current_user.roles:
        raise HTTPException(status_code=403, detail="Only admins can create categories")

    if db.query(Category).filter(Category.name == data.name).first():
        raise HTTPException(status_code=400, detail="Category already exists")

    category = Category(name=data.name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name).all()