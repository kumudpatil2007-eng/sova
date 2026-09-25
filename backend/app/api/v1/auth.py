from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.auth import verify_password, get_password_hash, create_access_token, get_current_user
from app.models.user import User
from app.models.audit_log import AuditLog
from app.schemas.user import UserCreate, UserLogin, UserOut, TokenOut

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

@router.post("/register", response_model=UserOut)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == user_in.email)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="User email already registered on sovereign system.")
        
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role.upper(),
        department=user_in.department
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=TokenOut)
async def login_user(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == login_data.email)
    user = (await db.execute(stmt)).scalar_one_or_none()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid sovereign credentials"
        )
        
    token = create_access_token({"sub": user.email, "role": user.role})
    
    # Log successful login to immutable audit log
    audit = AuditLog(
        user_id=user.id,
        event_type="LOGIN",
        actor_email=user.email,
        actor_role=user.role,
        action_details=f"User authenticated into SOVA Workbench with role {user.role}.",
        external_calls_detected=0,
        ip_address="127.0.0.1"
    )
    db.add(audit)
    await db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
