import os
import json
from config import *
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

llm_model = "gpt-4-0613"
OPENAI_API_KEY = openai_API_key
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

chat = ChatOpenAI(temperature=1, model=llm_model)


string_template = """Give 5 words written in Kanji that are: ```{description}```, \
accompanied with its correct Hiragana reading and three incorrect Hiragana readings \
that are realistic and relevant to the correct answer. \
Also give me the English translation of the word, and present the word within the context \
of a Japanese sentence, and also provide its English translation.

Format the output as JSON with the data represented as an array of dictionaries with the following keys:
"word": str  // Japanese word written in Kanji
"correct": str  // Correct reading of the Kanji word in Hiragana
"incorrect": List[str] //Incorrect readings of the Kanji phrase
"english": str  // English translation of the Kanji word
"sentenceJP": str  // Example sentence in Japanese using the Kanji word
"sentenceEN": str  // English translation of the example sentence
"""

prompt_template = ChatPromptTemplate.from_template(string_template)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_words', methods=['POST'])
def get_word():
    description = request.json.get('description', '')
    words_request = prompt_template.format_messages(description=description)
    words_response = chat(words_request)
    return jsonify(json.loads(words_response.content))

if __name__ == "__main__":
    app.run(port=5000)
