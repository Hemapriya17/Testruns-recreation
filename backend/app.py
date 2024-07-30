from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os
import fitz
import ast
from werkzeug.utils import secure_filename
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain_community.chat_models import ChatOpenAI
from langchain_community.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire application

# Create the uploads directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extract_text_from_pdf(pdf_path: str) -> list:
    document = fitz.open(pdf_path)
    contents = []
    for page_num in range(len(document)):
        page = document.load_page(page_num)
        text = page.get_text("text")
        contents.append(text)
    return contents

@app.route('/upload', methods=['POST'])
def upload_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        loader = PyPDFLoader(file_path)
        data = loader.load()

        if len(data) < 90:
            contents = extract_text_from_pdf(file_path)
            contents = '\n'.join(contents)
            if contents:
                text_splitter = RecursiveCharacterTextSplitter(chunk_size=20000, chunk_overlap=0)
                docs = [Document(page_content=x) for x in text_splitter.split_text(contents)]

                OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
                llm = ChatOpenAI(model_name="gpt-4-1106-preview", temperature=0, openai_api_key=OPENAI_API_KEY)
                chain = load_qa_chain(llm, chain_type="stuff")
                prompt = """Extract all the test cases (only Title) with the clause number from the above text. 
                Return the response as dictionary with its respective clauses. 
                Don't return any unwanted texts and headings like scope, general. 
                Final answer should be in the following format: 
                '''json {'text':[headings],'clause':[respective clauses]}'''. 
                Ensure that all strings are enclosed in double quotes. Don't return any unwanted quotes like ``` json"""

                response = chain.run(input_documents=docs, question=prompt, verbose=True)
                if 'json' in response:
                    response = response.split('\n',1)[1]
                    response = response.rsplit('\n',1)[0]
                dict_response = ast.literal_eval(response)

                return jsonify(dict_response)
        else:
            # Handle large PDF processing with Pinecone
            pass
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
