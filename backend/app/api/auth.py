from datetime import timezone
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    if not credentials:
        # Fallback to default faculty user for seamless development/testing
        stmt = select(User).where(User.role == "faculty").limit(1)
        res = await db.execute(stmt)
        return res.scalar_one_or_none()

    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: int = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None

    stmt = select(User).where(User.id == int(user_id))
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Support role-based demo quick switch
    desired_role = (req.role or "faculty").lower()
    stmt = select(User).where(User.role == desired_role)
    if req.email and "@" in req.email:
        # Check if email matches a specific user
        email_stmt = select(User).where(User.email == req.email)
        user_res = await db.execute(email_stmt)
        user = user_res.scalar_one_or_none()
        if not user:
            # Fallback to role match
            user_res = await db.execute(stmt)
            user = user_res.scalars().first()
    else:
        user_res = await db.execute(stmt)
        user = user_res.scalars().first()

    if not user:
        # Create a default user if none found
        user = User(
            email=req.email if req.email else f"{desired_role}@college.edu",
            full_name="Prof. Sarah Jenkins" if desired_role == "faculty" else "Aarav Mehta",
            role=desired_role,
            hashed_password="hashed_demo_password"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )

@router.get("/me", response_model=UserOut)
async def get_me(user: Optional[User] = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
