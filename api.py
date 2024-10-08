from flask import Flask, request, jsonify
from flask_cors import CORS
# import traceback
from langchain_handler import crawl_website, initialize_langchain, process_user_message, clear_vector_db

# Create the Flask app instance
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Global variable to track LangChain initialization
langchain_initialized = False

@app.route('/end_session', methods=['POST'])
def end_session():
    clear_vector_db()
    return jsonify({"message": "Session ended and vector DB cleared"}), 200

@app.route('/crawl', methods=['POST'])
def crawl():
    global langchain_initialized
    try:
        website = request.json['website']
        print(f"Received request to crawl: {website}")
        
        crawled_data = crawl_website(website)
        print(f"Crawled {len(crawled_data)} pages")
        
        if not crawled_data:
            return jsonify({
                "message": "No pages were crawled. The website might be inaccessible.",
                "success": False,
            }), 400
        
        if initialize_langchain(crawled_data):
            langchain_initialized = True
            print("LangChain initialized successfully")
            return jsonify({
                "message": "Crawling and initialization complete",
                "success": True
                # "favicon_path": '/favicon.ico'
            })
        else:
            print("Failed to initialize LangChain")
            return jsonify({"error": "Failed to initialize LangChain", "success": False}), 500
    except Exception as e:
        print(f"An error occurred during crawling: {str(e)}")
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/chat', methods=['POST'])
def chat():
    global langchain_initialized
    try:
        if not langchain_initialized:
            print("Attempted to chat before LangChain initialization")
            return jsonify({"error": "LangChain not initialized. Please crawl a website first."}), 400
        
        message = request.json['message']
        print(f"Received message: {message}")
        response, _ = process_user_message(message, [])
        print(f"Sending response: {response}")
        return jsonify({"response": response})
    except Exception as e:
        print(f"An error occurred in /chat: {str(e)}")
        # print("Full traceback:")
        # print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

# @app.route('/initial_greeting', methods=['GET'])
# def initial_greeting():
#     print("Received request for initial greeting")
#     response = {"response": "Hi, I'm an AI assistant. Please initialize me by crawling a website first."}
#     print("Sending response:", response)
#     return jsonify(response)

# @app.route('/check-initialization', methods=['GET'])
# def check_initialization():
#     return jsonify({"initialized": langchain_initialized})

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)