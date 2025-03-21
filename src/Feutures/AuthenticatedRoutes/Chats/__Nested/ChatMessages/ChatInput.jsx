import {
  Box,
  Flex,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { FaFile, FaTimes } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
const blobToFile = (blob, fileName, mimeType = blob.type) => {
  return new File([blob], fileName, { type: mimeType });
};
export const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [audio, setAudio] = useState();
  const fileInputRef = useRef(null);
  const recorderControls = useAudioRecorder();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSend = async () => {
    await onSend({ text: message, file, audio });
    setMessage("");
    setFile(null);
    setAudio(null);
  };

  return (
    <Flex direction="column" gap="3">
      {file && (
        <Box
          p={3}
          borderRadius="lg"
          border="1px solid #ccc"
          display="flex"
          alignItems="center"
          gap="3"
        >
          {file.type.startsWith("image/") ? (
            <Image
              src={URL.createObjectURL(file)}
              boxSize="50px"
              borderRadius="md"
            />
          ) : (
            <Flex alignItems="center" gap="2">
              <FaFile size={24} />
              <Text fontSize="sm">{file.name}</Text>
            </Flex>
          )}
          <IconButton
            size="sm"
            colorScheme="red"
            icon={<FaTimes />}
            onClick={() => setFile(null)}
          />
        </Box>
      )}
      {audio && (
        <Flex
          alignItems="center"
          p="2"
          borderRadius="lg"
          border="1px solid #ccc"
          w="100%"
          gap="5"
        >
          <audio controls src={URL.createObjectURL(audio)} />
          <IconButton
            size="sm"
            colorScheme="red"
            icon={<FaTimes />}
            onClick={() => setAudio()}
          />
        </Flex>
      )}

      <Flex alignItems="center" gap="3">
        <AudioRecorder
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
          downloadOnSavePress={false}
          downloadFileExtension="mp3"
          onRecordingComplete={(blob) => {
            const audioFile = blobToFile(blob, "Audio.mp3", "mp3");
            setAudio(audioFile);
          }}
          recorderControls={recorderControls}
          classes="recorder"
        />

        <Input
          onChange={(e) => setMessage(e.target.value)}
          placeholder="ارسال رسالة"
          size="lg"
          value={message}
          borderRadius="lg"
        />

        <IconButton
          isLoading={isLoading}
          onClick={handleSend}
          colorScheme="blue"
          size="lg"
          icon={<IoIosSend />}
        />

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <IconButton
          size="lg"
          colorScheme="orange"
          onClick={() => fileInputRef.current.click()}
          icon={<FaFile />}
        />
      </Flex>
    </Flex>
  );
};
