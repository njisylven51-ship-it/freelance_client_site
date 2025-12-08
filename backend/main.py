from datetime import datetime, timedelta, date
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlmodel import SQLModel, Field, Session, create_engine, select

# ---------------------------------------------------
# CONFIG
# ---------------------------------------------------

DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL, echo=True)

SECRET_KEY = "supersecretkey"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI()

# ---------------------------------------------------
# MODELS
# ---------------------------------------------------

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str


class UserCreate(SQLModel):
    username: str
    email: str
    password: str


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_name: str
    budget: float
    status: bool
    task: str
    client_name: str
    due_date: Optional[date] = None
    earning: float
    comment: Optional[str] = None
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")


class ProjectCreate(SQLModel):
    project_name: str
    budget: float
    status: bool
    task: str
    client_name: str
    due_date: Optional[date] = None
    earning: float
    comment: Optional[str] = None


class ProjectUpdate(SQLModel):
    project_name: Optional[str] = None
    budget: Optional[float] = None
    status: Optional[bool] = None
    task: Optional[str] = None
    client_name: Optional[str] = None
    due_date: Optional[date] = None
    earning: Optional[float] = None
    comment: Optional[str] = None


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# ---------------------------------------------------
# AUTH HELPERS
# ---------------------------------------------------

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_token(data: dict, expires: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )


def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
    return session.get(User, user_id)


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    payload = decode_token(token)
    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(401, "Invalid token")

    with Session(engine) as session:
        user = get_user_by_id(session, user_id)
        if not user:
            raise HTTPException(401, "User not found")
        return user

# ---------------------------------------------------
# SIGNUP
# ---------------------------------------------------

@app.post("/signup", status_code=201)
def signup(user_in: UserCreate):
    with Session(engine) as session:
        if session.exec(select(User).where(User.username == user_in.username)).first():
            raise HTTPException(400, "Username already exists")

        if session.exec(select(User).where(User.email == user_in.email)).first():
            raise HTTPException(400, "Email already registered")

        user = User(
            username=user_in.username,
            email=user_in.email,
            hashed_password=hash_password(user_in.password)
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        return {"message": "User created", "user_id": user.id}

# ---------------------------------------------------
# LOGIN (OAuth2)
# ---------------------------------------------------

@app.post("/login")
def login(data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == data.username)).first()

        if not user:
            raise HTTPException(404, "User not found")

        if not verify_password(data.password, user.hashed_password):
            raise HTTPException(401, "Incorrect password")

        token = create_token({"user_id": user.id, "username": user.username})

        return {"access_token": token, "token_type": "bearer"}

# ---------------------------------------------------
# PROJECT CRUD (protected)
# ---------------------------------------------------

@app.post("/projects", response_model=Project)
def create_project(project_in: ProjectCreate, current_user: User = Depends(get_current_user)):
    project = Project(**project_in.dict(), owner_id=current_user.id)

    with Session(engine) as session:
        session.add(project)
        session.commit()
        session.refresh(project)
        return project


@app.get("/projects", response_model=List[Project])
def list_projects(current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        return session.exec(
            select(Project).where(Project.owner_id == current_user.id)
        ).all()


@app.get("/projects/{project_id}", response_model=Project)
def get_project(project_id: int, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        project = session.get(Project, project_id)

        if not project or project.owner_id != current_user.id:
            raise HTTPException(404, "Project not found")

        return project


@app.put("/projects/{project_id}", response_model=Project)
def update_project(project_id: int, data: ProjectUpdate, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        project = session.get(Project, project_id)

        if not project or project.owner_id != current_user.id:
            raise HTTPException(404, "Project not found")

        updates = data.dict(exclude_unset=True)
        for k, v in updates.items():
            setattr(project, k, v)

        session.add(project)
        session.commit()
        session.refresh(project)
        return project


@app.delete("/projects/{project_id}")
def delete_project(project_id: int, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        project = session.get(Project, project_id)

        if not project or project.owner_id != current_user.id:
            raise HTTPException(404, "Project not found")

        session.delete(project)
        session.commit()
        return {"message": "Project deleted"}
