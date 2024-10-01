__all__ = ['crawl_website', 'initialize_langchain', 'process_user_message', 'conversational_retrieval_chain']

import os
import dotenv
from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.runnables import RunnablePassthrough, RunnableBranch
from langchain_core.output_parsers import StrOutputParser
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

# Load environment variables
dotenv.load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
USER_AGENT = os.getenv("USER_AGENT")

# Initialize global variables
chat = None
retriever = None
document_chain = None
conversational_retrieval_chain = None

def crawl_website(start_url, max_pages=30):
    visited = set()
    to_visit = [start_url]
    base_domain = urlparse(start_url).netloc
    pages = []

    while to_visit and len(visited) < max_pages:
        url = to_visit.pop(0)
        if url not in visited and urlparse(url).netloc == base_domain:
            try:
                response = requests.get(url, headers={'User-Agent': USER_AGENT})
                soup = BeautifulSoup(response.text, 'html.parser')
                pages.append({'url': url, 'content': soup.get_text()})
                visited.add(url)

                for link in soup.find_all('a', href=True):
                    new_url = urljoin(url, link['href'])
                    if new_url not in visited and urlparse(new_url).netloc == base_domain:
                        to_visit.append(new_url)
            except Exception as e:
                print(f"Error crawling {url}: {e}")
    for i in pages:
        print(i['url'])
    return pages

def initialize_langchain(crawled_data):
    global chat, retriever, document_chain, conversational_retrieval_chain

    try:
        os.environ["OPENAI_API_KEY"] = api_key
        chat = ChatOpenAI(model="gpt-3.5-turbo-1106", temperature=0.2)

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
        all_splits = []

        for page in crawled_data:
            splits = text_splitter.split_text(page['content'])
            all_splits.extend(splits)

        vectorstore = Chroma.from_texts(texts=all_splits, embedding=OpenAIEmbeddings())
        retriever = vectorstore.as_retriever(k=4)

        SYSTEM_TEMPLATE = """
        Answer the user's questions based on the below context. Answer like you're an AI assistant trained on the company's website data. The user's satisfaction is your utmost priority, make them feel welcome and safe, talk like a human in first person and make sure they are satisfied and are happy with the information you provide. 
        If the context doesn't contain any relevant information to the question, don't make something up and just say "I don't have information about that in my current knowledge base":
        
        <context>
        {context}
        </context>
        """

        question_answering_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", SYSTEM_TEMPLATE),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        document_chain = create_stuff_documents_chain(chat, question_answering_prompt)

        query_transform_prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="messages"),
                (
                    "user",
                    "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Only respond with the query, nothing else.",
                ),
            ]
        )

        query_transformation_chain = query_transform_prompt | chat

        query_transforming_retriever_chain = RunnableBranch(
            (
                lambda x: len(x.get("messages", [])) == 1,
                (lambda x: x["messages"][-1].content) | retriever,
            ),
        query_transform_prompt | chat | StrOutputParser() | retriever,
            ).with_config(run_name="chat_retriever_chain")

        conversational_retrieval_chain = RunnablePassthrough.assign(
        context=query_transforming_retriever_chain,
    ).assign(
        answer=document_chain,
    )

        print("LangChain initialization completed successfully")
        return True 

    except Exception as e:
        print(f"Error initializing LangChain: {str(e)}")
        print(traceback.format_exc())
        return False

def process_user_message(message_content, conversation_context):
    # Add the user's message to the context
    conversation_context.append(HumanMessage(content=message_content))

    # Limit the conversation context to the last 10 messages
    if len(conversation_context) > 10:
        conversation_context = conversation_context[-10:]

    response = conversational_retrieval_chain.invoke(
        {
            "messages": conversation_context
        }
    )
    # print(response)
    # Append the AI's response to the conversation context
    conversation_context.append(AIMessage(content=response["answer"]))

    return response["answer"], conversation_context