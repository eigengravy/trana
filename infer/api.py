from fastapi import BackgroundTasks, FastAPI
from pydantic import BaseModel
import httpx
from langchain.vectorstores import Chroma
from langchain.embeddings import GPT4AllEmbeddings
from langchain.chains import RetrievalQA
from langchain.llms import GPT4All
from bs4 import BeautifulSoup as bs
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os


class Input(BaseModel):
    query: str
    url: str


app = FastAPI()


@app.post("/infer")
async def infer(input: Input, background_tasks: BackgroundTasks):
    background_tasks.add_task(run_infer, input.query, input.url)
    return {"success": True, "message": "Queuing infer"}


def run_infer(query: str, url: str):  # noqa: F811
    scraped = os.path.exists(f"../vectordb/{hash(url)}")

    if not scraped:
        mainpage = bs(httpx.get(url=url).content, "lxml")

        soups = mainpage + list(
            map(
                lambda u: bs(httpx.get(url=u).content, "lxml"),
                set([a["href"] for a in mainpage.find_all("a", href=True)]),
            )
        )

        doc = Document(
            page_content=" ".join(
                [
                    elem.text.strip()
                    for soup in soups
                    for elem in soup.select("p, h1, h2, h3, h4, h5, h6")
                ]
            ),
            metadata={"source": "local"},
        )

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1024, chunk_overlap=64
        )
        texts = text_splitter.split_documents(doc)

        vectordb = Chroma.from_documents(
            texts,
            embedding=GPT4AllEmbeddings(),
            persist_directory=f"../vectordb/{hash(url)}",
        )

        vectordb.persist()
        httpx.post("http://localhost:6969/scrape/completed", data={url, query})

    if query != "":
        vectordb = Chroma(
            embedding=GPT4AllEmbeddings(), persist_directory=f"../vectordb/{hash(url)}"
        )
        qa_chain = RetrievalQA.from_chain_type(
            llm=GPT4All(model="./llama-2-7b-chat.ggmlv3.q4_0.bin", n_predict=512),
            retriever=vectordb.as_retriever(search_kwargs={"k": 8}),
        )
        response = qa_chain({"query": query})  # {query: str, result: str}
        answer = response["results"]
        httpx.post("http://localhost:6969/chat/answer", data={url, query, answer})
