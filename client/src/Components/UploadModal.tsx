import { useContext, useEffect, useState } from "react";
import { Typography, Button, Space, Progress, Input } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { GlobalContext } from "../Context/GlobalContext";
import { message, Upload } from "antd";
import logo from "../Assets/sensei.png";
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function UploadModal() {
  const {
    uploaded,
    setUploaded,
    setText,
    setUserPrompt,
    userPrompt,
    url,
    setUrl,
  } = useContext(GlobalContext);

  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csvfile, setCsvfile] = useState<any>();

  useEffect(() => {
    if (url !== "") setDone(true);
    else setDone(false);
  }, [userPrompt]);

  // const handleFileUpload = ({ file }: any) => {
  //   let formData = new FormData();
  //   formData.append("csv", file, file.name);

  //   axios
  //     .post("http://127.0.0.1:8000/api/files/", formData, {
  //       headers: {
  //         "Content-Type": "multpart/form-data",
  //       },
  //       onUploadProgress: (event) => {
  //         console.log(event);
  //         setCsvfile({
  //           name: file.name,
  //           progress: event.progress,
  //         });
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       if (response.status === 201) {
  //         message.success(`${file.name} uploaded successfully.`);
  //         setCsvfile({
  //           name: file.name,
  //           progress: 1,
  //           download: response.data.csv,
  //           id: response.data.id,
  //         });
  //         setDone(true);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       message.error(`${file.name} upload failed.`);
  //       setDone(false);
  //     });
  // };

  const handleSubmit = () => {
    setLoading(true);
    setUploaded(true);
    // const data = `id=${csvfile.id}`;
    // console.log(data);
    // axios
    //   .post("http://localhost:8000/api/files/formatter/", data, {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     setText(response.data.formatted_text);
    //     setTimeout(() => {
    //       setUploaded(true);
    //       setLoading(false);
    //     }, 1000);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     console.log(error);
    //   });
  };

  return (
    <div className="w-[25rem] flex flex-col py-5 items-center border-2 border-[#505050] rounded-lg">
      <img src={logo} className="w-32 h-32 mb-4" />
      <span className="text-[#919191] text-xl font-mono">Hey user</span>
      <span className="text-[#919191] text-xl font-mono">
        Please enter site URL
      </span>

      <Input
        type="text"
        placeholder="Site URL"
        required
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            url !== ""
              ? handleSubmit()
              : message.error("Please enter a site url.");
          }
        }}
        className="chat-input w-[18rem] mt-6 bg-transparent text-white text-opacity-75 text-base font-mono"
      />

      <TextArea
        placeholder="Custom prompts..."
        disabled={loading}
        onChange={(e) => {
          setUserPrompt(e.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            url !== ""
              ? handleSubmit()
              : message.error("Please enter a site url.");
          }
        }}
        className="chat-input w-[18rem] mt-6 text-white text-opacity-75 text-base font-mono"
        autoSize
      />

      <Button
        onClick={() => {
          url !== ""
            ? handleSubmit()
            : message.error("Please enter a site url.");
        }}
        loading={loading}
        className="flex items-center mt-6 text-[#919191] font-mono border-[#919191]"
        // icon={<UploadOutlined />}
        size="large"
      >
        Submit
      </Button>
    </div>
  );
}
