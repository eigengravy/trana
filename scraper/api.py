from fastapi import BackgroundTasks, FastAPI
from pydantic import BaseModel
from bs4 import BeautifulSoup as bs
import httpx
from langchain.docstore.document import Document
from langchain.vectorstores import Chroma
from langchain.embeddings import GPT4AllEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter


class Url(BaseModel):
    url: str


app = FastAPI()


@app.post("/scrape")
async def scrape(url: Url, background_tasks: BackgroundTasks):
    background_tasks.add_task(scrape, url.url)
    return {"success": True, "message": "Queuing scrape"}


def scrape(url: str):  # noqa: F811
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

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=64)
    texts = text_splitter.split_documents(doc)

    vectordb = Chroma.from_documents(
        texts,
        embedding=GPT4AllEmbeddings(),
        persist_directory=f"../vectordb/{hash(url)}",
    )

    vectordb.persist()

    httpx.post("http://localhost:6969/scrape/completed", data={"url": url})
