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
            0 : "assets/driving_videos/neutral.mp4",
            1 : "assets/driving_videos/joy.mov",
            2 : "assets/driving_videos/sad.mp4",
            3 : "assets/driving_videos/anger.mp4",
            4 : "assets/driving_videos/surprise.mp4",
            5 : "assets/driving_videos/disgust.mp4",
            6 : "assets/driving_videos/fear.mp4"
        }
        response = requests.get(url)
        buffer = BytesIO(response.content)
        uri = ModelUtils.generate_video(buffer,emotion_videos[emotion_id])
        data = {"url" : uri}
        return data
