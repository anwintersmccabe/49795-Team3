import React, { useState } from "react";
import { Upload, Button, Select, message, Card, Divider } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
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
  const [showNextButton, setShowNextButton] = useState(false);

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

    message.loading({ content: "Generating videos, this may take some time. Please wait...", key: "generateVideos" });
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

    message.success({ content: "Videos generated successfully!", key: "generateVideos", duration: 2 });
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
  const nextVideo = () => {
    if (selectedVideoIndex < generatedVideos.length - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1);
    } else {
      setSelectedVideoIndex(0); // Reset the index to 0 for a never-ending loop
    }
    setUserGuess(null);
    setGameResult(null);
    setShowNextButton(false);
  };

  const submitAnswer = () => {
    if (!userGuess) {
      message.error("Please select an emotion");
      return;
    }

    if (userGuess === generatedVideos[selectedVideoIndex].emotion) {
      setGameResult("Correct!");
    } else {
      setGameResult(
        `Incorrect. The correct answer is ${generatedVideos[selectedVideoIndex].emotion}.`
      );
    }
    var msg = new SpeechSynthesisUtterance();
    msg.text = generatedVideos[selectedVideoIndex].emotion;
    window.speechSynthesis.speak(msg);
    setShowNextButton(true);
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div>
            <Dragger
              {...uploadProps}
              style={{
                width: "100%",
                maxWidth: "600px",
                borderColor: "#FFB6C1",
              }}
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
                  <UploadOutlined style={{ color: "#FFB6C1" }} /> Click or drag
                  a photo here to upload
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
          </div>
          <Divider
            type="vertical"
            style={{ height: "100%", margin: "0 20px" }}
          />
          {selectedVideoIndex !== null && (
            <div>
              <video
                src={generatedVideos[selectedVideoIndex].url}
                controls
                style={{ height: "200px" }}
              />
              <Select
                value={userGuess}
                onChange={(value) => setUserGuess(value)}
                style={{ width: "100%", marginTop: "10px" }}
              >
                {emotions.map((emotion) => (
                  <Option key={emotion} value={emotion}>
                    {emotion}
                  </Option>
                ))}
              </Select>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Button onClick={submitAnswer} style={{ marginTop: "10px" }}>
                  Submit
                </Button>
                {gameResult && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <h3>{gameResult}</h3>
                    {showNextButton && (
                      <Button onClick={nextVideo} style={{ marginTop: "10px" }}>
                        Next
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default App;
