# Trana

Co-pilot for the web powered by Llama2.

## Architecture

The project is divided in 3 modules.

- Frontend : React.js frontend using the Ant Design component library.
- Backend : Django backend using Redis for KV store.
- Inference : FastAPI server running an inference endpoint for GPT4All's llama-2-7b-chat.ggmlv3.q4_0 powered by Langchain.
