# Trana

Co-pilot for the web powered by Llama2.

## Architecture

The project is divided in 3 modules.

- Frontend : React.js frontend using the Ant Design component library.
- Backend : Django backend using Redis for KV store.
- Inference : FastAPI server running an inference endpoint for GPT4All's llama-2-7b-chat.ggmlv3.q4_0 powered by Langchain. Also performs data scraping 
using BeautifulSoup and caches the  embeddings into a persistent Chroma vectorstore.

## Screenshots
<p float="left">
<img src="assets/ui-1.jpg?raw=true" width="350" title="hover text">
<img src="assets/ui-2.jpg?raw=true" width="350" title="hover text">
</p>


