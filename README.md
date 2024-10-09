# RAG Chatbot

This web app is a customized Retrieval-Augmented Generation (RAG) chatbot built using Langchain, Python, and React. The chatbot provides detailed information and assistance based on a curated knowledge base. (Will be deployed soon, currently debugging deployment errors.)

## Features

- **Information Retrieval**: The chatbot retrieves relevant information from a curated knowledge base. Currently using LangChain (will be setting up a custom pipeline instead)
- **Conversational AI**: Utilizes OpenAI's GPT model to generate human-like responses.
- **Customizable Responses**: Designed to handle specific queries and provide informative answers.
- **Responsive Design**: The user interface is optimized for various devices, ensuring a seamless user experience.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/rag-chatbot.git
   cd rag-chatbot
   ```

2. **Install Python dependencies**:
   Make sure you have Python installed, then run:
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**:
   Navigate to the `chatbot-ui` directory and install the Node.js dependencies:
   ```bash
   cd chatbot-ui
   npm install
   ```

4. **Run the development server**:
   Start the server using:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the result.

## Technologies Used

- **Langchain**: For building and managing the knowledge base and handling document retrieval.
- **OpenAI GPT**: To generate conversational responses.
- **Python**: The core programming language used for developing the backend.
- **Next.js**: A React framework for building the frontend.
- **Axios**: For making HTTP requests from the frontend.
- **Tailwind CSS**: For styling the user interface.
- **Heroku**: Hosting platform for deploying the web app.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please reach out to the project maintainers.

---

Thank you for using the RAG Chatbot! I hope you find it helpful and informative.
