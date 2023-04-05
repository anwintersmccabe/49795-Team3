from flask import Flask, request
from werkzeug.utils import secure_filename
from model_utils import ModelUtils
from flask_cors import CORS
from urllib.request import urlopen
from io import BytesIO
import requests
app = Flask(__name__)
CORS(app)


@app.route("/upload", methods=['POST'])
def upload_image():
    if request.method == 'POST':
        json_data = request.get_json()
        print(json_data)
        #f.save(secure_filename(f.filename))
        url = json_data["url"]
        response = requests.get(url)
        buffer = BytesIO(response.content)
        uri = ModelUtils.generate_video(buffer,"assets/driving_videos/happy.mov")
        data = {"url" : uri}
        return data
