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

# Load environment variables
dotenv.load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize LangChain components


def initialize_langchain():
    global chat, retriever, document_chain, conversational_retrieval_chain

    os.environ["OPENAI_API_KEY"] = api_key
    chat = ChatOpenAI(model="gpt-3.5-turbo-1106", temperature=0.2)

    # List of websites to scrape
    urls = [
        "https://inflection.ai/partnering-with-the-white-house-on-ai-safety",
        "https://inflection.ai/assets/MMLU-Examples.pdf",
        "https://inflection.ai/pi-is-available-wherever-you-are",
        "https://inflection.ai/inflection-2-5",
        "https://inflection.ai/the-future-of-pi",
        "https://inflection.ai/inflection-1",
        "https://inflection.ai/reid-hoffman",
        "https://inflection.ai/assets/Inflection-1.pdf",
        "https://inflection.ai/company",
        "https://inflection.ai/inflection-2",
        "https://inflection.ai/frontier-safety",
        "https://inflection.ai/the-new-inflection",
        "https://inflection.ai/press",
        "https://inflection.ai/pi-now-available-on-android",
        "https://inflection.ai/cdn-cgi/l/email-protection",
        "https://inflection.ai/careers",
        "https://inflection.ai/mustafa-suleyman",
        "https://inflection.ai/karen-simonyan",
        "https://inflection.ai/inflection-ai-announces-1-3-billion-of-funding",
        "https://inflection.ai/",
        "https://inflection.ai/nvidia-coreweave-mlperf",
        "https://inflection.ai/why-create-personal-ai",
        "https://inflection.ai/an-inflection-point",
        "https://inflection.ai/g7-hiroshima-code-of-conduct",
        "https://inflection.ai/redefining-the-future-of-ai"
    ]

    all_data = []
    for url in urls:
        loader = WebBaseLoader(url)
        data = loader.load()
        all_data.extend(data)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, chunk_overlap=0)
    all_splits = text_splitter.split_documents(all_data)

    vectorstore = Chroma.from_documents(
        documents=all_splits, embedding=OpenAIEmbeddings())
    retriever = vectorstore.as_retriever(k=4)

    SYSTEM_TEMPLATE = """
    Answer the user's questions based on the below context. Answer like you're the employee of the company and are answering questions on behalf of the company to a customer. The customer's satisfaction is your utmost priority, make them feel welcome and safe, talk like a human in first person and make sure they are satisfied and are happy with the information you provide. 
    If the context doesn't contain any relevant information to the question, don't make something up and just say "I don't know":
    
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

    document_chain = create_stuff_documents_chain(
        chat, question_answering_prompt)

    query_transform_prompt = ChatPromptTemplate.from_messages(
        [
            MessagesPlaceholder(variable_name="messages"),
            (
                "user",
                "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Only respond with the query, nothing else. Answer like you're an employee of the company and are answering a question to the consumer. Consumer satisfaction and respect is your utmost responsibility.",
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

    # Initialize conversation context with AI's greeting message
    conversation_context = [
        AIMessage(content="Hi, I am Inflection AI's personal AI assistant. As an employee, what can I help you with today? We recently collaborated with the Data Transfer Initiative, and I'd love to tell you about the Future of Pi!")
    ]


def process_user_message(message_content, conversation_context):
    # If conversation context is empty, initialize with the AI's greeting
    if not conversation_context:
        conversation_context.append(AIMessage(
            content="Hi, I am Inflection AI's personal AI assistant. As an employee, what can I help you with today? We recently collaborated with the Data Transfer Initiative, and I'd love to tell you about the Future of Pi!"))

    # Add the user's message to the context
    conversation_context.append(HumanMessage(content=message_content))

    # Limit the conversation context to the last 10 messages
    if len(conversation_context) > 10:
        conversation_context.pop(0)

    response = conversational_retrieval_chain.invoke(
        {
            "messages": conversation_context
        }
    )

    # Append the AI's response to the conversation context
    conversation_context.append(AIMessage(content=response["answer"]))

    return response["answer"], conversation_context
