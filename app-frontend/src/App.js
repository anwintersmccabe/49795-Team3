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
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

//import "antd/dist/antd.css";

const { Option } = Select;
const { Dragger } = Upload;
const { Header, Content, Footer } = Layout;

const emotions = [
  "neutral",
  "joy",
  "sadness",
  "anger",
  "surprise",
  "disgust",
  "fear",
];

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

    // Replace this with your logic for processing the image and generating the video
    setTimeout(() => {
      setProcessing(false);
      setVideoUrl("https://example.com/video.mp4");
    }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF0F5' }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2E7D32',
          }}
        >
          <h1 style={{ color: 'white', margin: 0 }}>Photo to Emotion Generator</h1>
        </Header>
        <Content
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '50px',
          }}
        >
          <Dragger {...uploadProps} style={{ width: '100%', maxWidth: '600px', borderColor: '#2E7D32' }}>
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
              />
            ) : (
              <p>
                <UploadOutlined style={{ color: '#2E7D32' }} /> Click or drag a photo here to upload
              </p>
            )}
          </Dragger>
          <Divider />
          <Select
            placeholder="Select an emotion"
            style={{ width: '100%', maxWidth: '600px', borderColor: '#2E7D32' }}
            onChange={(value) => setEmotion(value)}
          >
            {emotions.map((emotion) => (
              <Option key={emotion} value={emotion}>
                {emotion}
              </Option>
            ))}
          </Select>
          <Divider />
          <Button
            type="primary"
            onClick={processImage}
            disabled={processing}
            style={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: '#2E7D32',
              borderColor: '#2E7D32',
            }}
          >
            Generate Video
          </Button>
          {processing && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
              <p>Processing...</p>
            </div>
          )}
          {videoUrl && (
            <>
              <Divider />
              <h2>Generated Video</h2>
              <video src={videoUrl} width="100%" controls />
            </>
          )}
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            backgroundColor: '#2E7D32',
          }}
        >
          Photo to Emotion Generator ©2023
        </Footer>
      </Layout>
    </div>
  );
  
};

export default App;
