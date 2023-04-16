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
        print("here")
        json_data = request.get_json()
        print(json_data)
        #f.save(secure_filename(f.filename))
        url = json_data["url"]
        emotion_id = json_data["emotion_id"]
        emotion_videos = {
            0 : "assets/driving_videos/happy.mov",
            1 : "emotion2 video path here",
            2 : "emotion3 video path here",
            3 : "emotion4 video path here",
            4 : "emotion5 video path here",
            5 : "emotion6 video path here",
            6 : "emotion7 video path here"
        }
        response = requests.get(url)
        buffer = BytesIO(response.content)
        uri = ModelUtils.generate_video(buffer,emotion_videos[emotion_id])
        data = {"url" : uri}
        return data
