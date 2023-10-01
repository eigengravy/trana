<img src="client/public/logo512.png?raw=true" width="64" title="Trana">

# Trana

Co-pilot for the web. 

## Architecture

The project is divided in 3 modules.

- Frontend : React.js frontend using the Ant Design component library.
- Backend : Django backend using Redis for KV store.
- Inference : FastAPI server running an inference endpoint for GPT4All's llama-2-7b-chat.ggmlv3.q4_0 powered by Langchain. Also performs data scraping 
using BeautifulSoup and caches the  embeddings into a persistent Chroma vectorstore.

## Screenshots
<p float="left">
<img src="assets/ui-1.jpg?raw=true" width="350" title="Trana">
<img src="assets/ui-2.jpg?raw=true" width="350" title="Chat UI">
</p>

## Credits

Built by [Sarang](https://github.com/eigengravy) and [John](https://github.com/jxhnsebastian) for the [Moveworks](https://moveworks.com) Generative AI Hack-AI-thon 2023 at BITS Goa.
