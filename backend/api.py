from flask import Flask, request
from werkzeug.utils import secure_filename
from model_utils import ModelUtils

app = Flask(__name__)


@app.route("/upload", methods=['POST'])
def upload_image():
    if request.method == 'POST':
        f = request.files['file']
        f.save(secure_filename(f.filename))
        uri = ModelUtils.generate_video(f.filename,"assets/driving_videos/happy.mov")
        print(uri)
        return uri
