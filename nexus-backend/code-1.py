from pydantic import BaseModel

class Trial(BaseModel):
    name: str = "K"
    age: int = 21
    email: str = "k@gmail.com"

t = Trial()
print(t.model_dump())