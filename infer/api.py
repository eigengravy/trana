from fastapi import BackgroundTasks, FastAPI
from pydantic import BaseModel
import httpx
from langchain.vectorstores import Chroma
from langchain.embeddings import GPT4AllEmbeddings
from langchain.chains import RetrievalQA
from langchain.llms import GPT4All


class Query(BaseModel):
    query: str


app = FastAPI()


@app.post("/query")
async def query(query: Query, background_tasks: BackgroundTasks):
    background_tasks.add_task(query, query.query)
    return {"success": True, "message": "Queuing query"}


def query(query: str):  # noqa: F811
    vectordb = Chroma(embedding=GPT4AllEmbeddings(), persist_directory="./data")
    qa_chain = RetrievalQA.from_chain_type(
        llm=GPT4All(model="./llama-2-7b-chat.ggmlv3.q4_0.bin", n_predict=512),
        retriever=vectordb.as_retriever(search_kwargs={"k": 8}),
    )
    response = qa_chain({"query": query})  # {query: str, result: str}
    httpx.post("http://localhost:6969/chat/completed", data={"answer": response})
