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
    windowed,
  } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [csvfile, setCsvfile] = useState<any>();

  const getSite = () => {
    const data = JSON.stringify({
      url: url,
    });
    console.log(data);
    axios
      .post("http://localhost:8000/api/scrape/getSite/", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        console.log(response.data);
        if (!response.data.completed) {
          setTimeout(() => {
            getSite();
          }, 2000);
        } else {
          message.success(`Site data received`);
          setTimeout(() => {
            setUploaded(true);
            setLoading(false);
          }, 500);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleSubmit = () => {
    setLoading(true);
    const data = JSON.stringify({
      url: url,
    });
    console.log(data);
    axios
      .post("http://localhost:8000/api/scrape/queries/", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.received) {
          setTimeout(() => {
            getSite();
          }, 2000);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <div
      className={`w-[25rem] flex flex-col py-5 items-center ${
        windowed ? "" : "border-2 border-[#505050]"
      } rounded-lg`}
    >
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
              ? !loading && handleSubmit()
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
              ? !loading && handleSubmit()
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
