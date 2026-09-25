import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, List
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import settings
from app.core.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

class RoleEnum:
    ADMIN = "ADMIN"
    ENGINEER = "ENGINEER"
    MANAGER = "MANAGER"
    ANALYST = "ANALYST"
    DEVELOPER = "DEVELOPER"

def get_password_hash(password: str) -> str:
    salt = "mrpl_sovereign_2026_secure_salt"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    from app.models.user import User
    
    email = None
    if token:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            email = payload.get("sub")
        except JWTError:
            pass

    # If valid email in token
    if email:
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if user and user.is_active:
            return user

    # Fallback to default lead refinery engineer for seamless air-gap demo
    stmt = select(User).where(User.email == "engineer@mrpl.co.in")
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if user:
        return user

    # Fallback to first available user
    stmt = select(User).limit(1)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if user:
        return user

    # Create default user on-the-fly if DB was reset
    default_user = User(
        email="engineer@mrpl.co.in",
        full_name="Er. Rajesh K. Nayak (Lead Refinery Engineer)",
        hashed_password=get_password_hash("mrpl2026"),
        role="ENGINEER",
        department="Mechanical & Plant Integrity"
    )
    db.add(default_user)
    await db.commit()
    await db.refresh(default_user)
    return default_user

def require_roles(allowed_roles: List[str]):
    async def role_checker(current_user = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation restricted. Required roles: {allowed_roles}, Your role: {current_user.role}"
            )
        return current_user
    return role_checker
