import React, { useState } from "react";
import { Upload, Button, Select, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import storage from "./firebaseConfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//import "antd/dist/antd.css";

const { Option } = Select;
const { Dragger } = Upload;

const emotions = [
  "neutral",
  "joy",
  "sadness",
  "anger",
  "surprise",
  "disgust",
  "fear",
];

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
let urlToSend = "";
const App = () => {
  const [file, setFile] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [generatedVideos, setGeneratedVideos] = useState([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [userGuess, setUserGuess] = useState(null);
  const [gameResult, setGameResult] = useState(null);

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
    if (!file) {
      message.error("Please upload a photo.");
      return;
    }

    setProcessing(true);
    const newGeneratedVideos = await generateVideosForAllEmotions(file);
    setGeneratedVideos(shuffle(newGeneratedVideos));
    setSelectedVideoIndex(0);
    setProcessing(false);
    setUserGuess(null);
    setGameResult(null);
  };

  const generateVideosForAllEmotions = async (file) => {
    const generatedVideos = [];

    for (const [index, emotion] of emotions.entries()) {
      let formData = new FormData();

      formData.append("file", file);
      formData.append("emotion", emotion);

      let fileID = generateString(15) + file.name;
      console.log(fileID);

      const storageRef = ref(storage, `/files/${fileID}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const videoUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (err) => {
            console.log(err);
            reject(err);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
              urlToSend = url;
              let json = JSON.stringify({ url: urlToSend, emotion_id: index });
              console.log(json);
              console.log(typeof JSON);
              const requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: json,
              };
              let backendurl;
              if (!process.env.REACT_APP_AI_BACKEND_URL) {
                backendurl = "http://127.0.0.1:8000/upload";
              } else {
                backendurl = process.env.REACT_APP_AI_BACKEND_URL + "/upload";
              }
              console.log(backendurl);
              await fetch(backendurl, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                  resolve({ emotion, url: data.url });
                });
            });
          }
        );
      });

      generatedVideos.push(videoUrl);
    }

    return generatedVideos;
  };

  const shuffle = (array) => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#E9F0EB",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        title="Guess My Emotion"
        style={{
          width: "80%",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
        headStyle={{
          backgroundColor: "#2E7D32",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "10px 10px 0 0",
        }}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Dragger
          {...uploadProps}
          style={{ width: "250px", borderColor: "#2E7D32" }}
        >
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
          ) : (
            <p>
              <UploadOutlined style={{ color: "#2E7D32" }} /> Upload Photo
            </p>
          )}
        </Dragger>
        <Button
          type="primary"
          onClick={processImage}
          disabled={processing}
          loading={processing}
          style={{
            width: "200px",
            backgroundColor: "#2E7D32",
            borderColor: "#2E7D32",
            marginTop: "10px",
          }}
        >
          Generate Videos
        </Button>
        {selectedVideoIndex !== null && (
          <>
            <h2>Guess the emotion</h2>
            <video
              src={generatedVideos[selectedVideoIndex].url}
              width="100%"
              controls
            />
            <Select
              placeholder="Select an emotion"
              style={{
                width: "200px",
                borderColor: "#2E7D32",
                marginTop: "10px",
              }}
              onChange={(value) => setUserGuess(value)}
            >
              {emotions.map((emotion) => (
                <Option key={emotion} value={emotion}>
                  {emotion}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              onClick={() => {
                if (userGuess === generatedVideos[selectedVideoIndex].emotion) {
                  setGameResult("correct");
                } else {
                  setGameResult(
                    `wrong (correct answer: ${generatedVideos[selectedVideoIndex].emotion})`
                  );
                }
              }}
              disabled={!userGuess}
              style={{
                width: "200px",
                backgroundColor: "#2E7D32",
                borderColor: "#2E7D32",
                marginTop: "10px",
              }}
            >
              Submit
            </Button>
            {gameResult && <p>Result: {gameResult}</p>}
          </>
        )}
      </Card>
    </div>
  );
};

export default App;
