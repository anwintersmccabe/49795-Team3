import React, { useState } from "react";
import {
  Upload,
  Button,
  Select,
  Spin,
  message,
  Divider,
  Video,
  Layout,
  Card
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import storage from "./firebaseConfig.js"
import {
 ref,
  uploadBytesResumable,
  getDownloadURL
  } from "firebase/storage";

//import "antd/dist/antd.css";

const { Option } = Select;
const { Dragger } = Upload;
const { Header, Content, Footer } = Layout;

const emotions = [
  //"neutral",
  "joy",
  //"sadness",
  //"anger",
  //"surprise",
  //"disgust",
  //"fear",
];

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
let urlToSend = ""
const App = () => {
  const [file, setFile] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const uploadProps = {
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    onRemove: () => {
      setFile(null);
    },
  };

  const processImage = async () => {
    if (!file || !emotion) {
      message.error("Please upload a photo and select an emotion");
      return;
    }

    setProcessing(true);
    let formData = new FormData();

    formData.append("file", file);

    let fileID = generateString(15) + file.name
    console.log(fileID)
    
    const storageRef = ref(storage, `/files/${fileID}`)
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
        "state_changed",
        null,
      (err) => console.log(err),
      () => {
      // download url
      getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
      urlToSend = url
      let json = JSON.stringify({"url": urlToSend})
      console.log(json)
      console.log(typeof(JSON))
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
          },
        body: json }

        
        await fetch('http://127.0.0.1:8000/upload', requestOptions)
        .then(response => response.json())
        .then(data => setVideoUrl(data.url))
        .then(data => setProcessing(false));
      });

      }
      ); 
      

  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#E9F0EB',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        title="Photo to Video Generator"
        style={{
          width: '80%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
        }}
        headStyle={{
          backgroundColor: '#2E7D32',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: '10px 10px 0 0',
        }}
        bodyStyle={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Dragger {...uploadProps} style={{ width: '250px', borderColor: '#2E7D32' }}>
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
            />
          ) : (
            <p>
              <UploadOutlined style={{ color: '#2E7D32' }} /> Upload Photo
            </p>
          )}
        </Dragger>
        <div>
          <Select
            placeholder="Select an emotion"
            style={{ width: '200px', borderColor: '#2E7D32' }}
            onChange={(value) => setEmotion(value)}
          >
            {emotions.map((emotion) => (
              <Option key={emotion} value={emotion}>
                {emotion}
              </Option>
            ))}
          </Select>
          <br />
          <Button
            type="primary"
            onClick={processImage}
            loading = {processing}
            style={{
              width: '200px',
              backgroundColor: '#2E7D32',
              borderColor: '#2E7D32',
              marginTop: '10px',
            }}
          >
            Generate Video
          </Button>
        </div>
        {videoUrl && (
          <>
            <Divider />
            <h2>Generated Video</h2>
            <video src={videoUrl} width="100%" controls />
          </>
        )}
      </Card>
    </div>
  );  
};

export default App;
