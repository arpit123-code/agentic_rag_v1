# from app.services.ingestion import load_file, chunk_documents
# from pathlib import Path

# file=Path("data/sample_kb/company_it_handbook.md")

# docs=load_file(file)
# docs1=chunk_documents(docs)

# print (f"Loaded {docs1} documents from {file}")

# import os
# # from urllib import response
# from dotenv import load_dotenv
# from langchain_openai import ChatOpenAI

# load_dotenv()

# llm = ChatOpenAI(
#     model="z-ai/glm-5.3-flash",
#     base_url="https://integrate.api.nvidia.com/v1"
#     temperature=0,
    
#     max_tokens=1024,
# )

# response = llm.invoke("What is the capital of France?")
# print (response.content)

# from app.services.ingestion import load_file, chunk_documents
# from pathlib import Path
# from app.rag.vectorstore import add_document

# doc=load_file(Path("data/sample_kb/company_it_handbook.md"))
# chunks=chunk_documents(doc)
# add_document(chunks)


# from langchain_ollama import ChatOllama

# llm = ChatOllama(
#     base_url="https://commands-forest-consulting-badly.trycloudflare.com",
#     model="qwen3.8-27b-uncensored-mtp",
#     temperature=0,
#     num_ctx=65536,  # Matches the 64K context set in the notebook
# )
# a=input("Enter your question: ")
# print("\nResponse: ", end="", flush=True)

# # Stream tokens in real time as they are generated
# for chunk in llm.stream(a):
#     print(chunk.content, end="", flush=True)

# print()

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
