from flask import Flask, request
from werkzeug.utils import secure_filename
from model_utils import ModelUtils
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/upload", methods=['POST'])
def upload_image():
    if request.method == 'POST':
        f = request.files['file']
        f.save(secure_filename(f.filename))
        uri = ModelUtils.generate_video(f.filename,"assets/driving_videos/happy.mov")
        data = {"url" : uri}
        return data
