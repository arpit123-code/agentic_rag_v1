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
#     base_url="https://integrate.api.nvidia.com/v1",
#     api_key="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",
#     temperature=0,
    
#     max_tokens=1024,
# )

# response = llm.invoke("What is the capital of France?")
# print (response.content)

from app.services.ingestion import load_file, chunk_documents
from pathlib import Path
from app.rag.vectorstore import add_document

doc=load_file(Path("data/sample_kb/company_it_handbook.md"))
chunks=chunk_documents(doc)
add_document(chunks)
