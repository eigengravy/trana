from fastapi import BackgroundTasks, FastAPI, Request
from pydantic import BaseModel
import httpx
from langchain.vectorstores import Chroma
from langchain.embeddings import GPT4AllEmbeddings
from langchain.chains import RetrievalQA
from langchain.llms import GPT4All
from bs4 import BeautifulSoup as bs
from langchain.schema.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from urllib.parse import urljoin


class Input(BaseModel):
    query: str | None
    url: str


app = FastAPI()


@app.post("/infer")
async def infer(req: Request, background_tasks: BackgroundTasks):
    body = await req.json()
    background_tasks.add_task(run_infer, body["query"], body["url"])
    return {"success": True, "message": "Queuing infer"}


def run_infer(query: str, url: str):  # noqa: F811
    print("this is url", url)
    key = "".join([c for c in url if c.isalnum()])
    print(key)
    scraped = os.path.exists(f"../vectordb/{key}")

    if not scraped:
        mainpage = bs(httpx.get(url=url).content, "lxml")
        urls = set([a["href"] for a in mainpage.find_all("a", href=True)])
        # print(urls)
        soups = [mainpage] + list(
            map(
                lambda u: bs(
                    httpx.get(
                        url=u if u.startswith("http") else urljoin(url, u)
                    ).content,
                    "lxml",
                ),
                list(urls),
            )
        )

        print("cooked soup")

        doc = [
            Document(
                page_content=" ".join(
                    [
                        elem.text.strip()
                        for soup in soups
                        for elem in soup.select("p, h1, h2, h3, h4, h5, h6")
                    ]
                ),
                metadata={"source": "local"},
            )
        ]

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1024, chunk_overlap=64
        )
        texts = text_splitter.split_documents(doc)

        print("got docs")
        vectordb = Chroma.from_documents(
            texts,
            embedding=GPT4AllEmbeddings(),
            persist_directory=f"../vectordb/{key}",
        )
        print("made vec")

        vectordb.persist()

        print("saved vec")

        httpx.post(
            "http://localhost:8000/api/scrape/completed/",
            json={"url": url, "query": query},
        )

    if query is not None:
        vectordb = Chroma(
            embedding=GPT4AllEmbeddings(), persist_directory=f"../vectordb/{key}"
        )
        print("load vec")

        qa_chain = RetrievalQA.from_chain_type(
            llm=GPT4All(model="./llama-2-7b-chat.ggmlv3.q4_0.bin", n_predict=512),
            retriever=vectordb.as_retriever(search_kwargs={"k": 8}),
        )
        print("load llm")

        response = qa_chain({"query": query})  # {query: str, result: str}
        print("out")

        answer = response["results"]
        httpx.post("http://localhost:8000/api/chat/answer/", json={url, query, answer})
    else:
        httpx.post(
            "http://localhost:8000/api/scrape/completed/",
            json={"url": url, "query": query},
        )
