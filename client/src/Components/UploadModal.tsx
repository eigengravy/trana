import { useContext, useState } from "react";
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
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function UploadModal() {
  const { uploaded, setUploaded, setText, setUserPrompt } =
    useContext(GlobalContext);

  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csvfile, setCsvfile] = useState<any>();

  const handleFileUpload = ({ file }: any) => {
    let formData = new FormData();
    formData.append("csv", file, file.name);

    axios
      .post("http://127.0.0.1:8000/api/files/", formData, {
        headers: {
          "Content-Type": "multpart/form-data",
        },
        onUploadProgress: (event) => {
          console.log(event);
          setCsvfile({
            name: file.name,
            progress: event.progress,
          });
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          message.success(`${file.name} uploaded successfully.`);
          setCsvfile({
            name: file.name,
            progress: 1,
            download: response.data.csv,
            id: response.data.id,
          });
          setDone(true);
        }
      })
      .catch((error) => {
        console.log(error);
        message.error(`${file.name} upload failed.`);
        setDone(false);
      });
  };

  const handleSubmit = () => {
    setLoading(true);
    const data = `id=${csvfile.id}`;
    console.log(data);
    axios
      .post("http://localhost:8000/api/files/formatter/", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        console.log(response.data);
        setText(response.data.formatted_text);
        setTimeout(() => {
          setUploaded(true);
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="w-[25rem] flex flex-col py-7 items-center border-2 border-[#505050] rounded-lg">
      <span className="text-[#919191] text-xl font-mono">Hey user</span>
      <span className="text-[#919191] text-xl font-mono">
        Please upload your file
      </span>
      {/* <div className="w-[18rem] min-h-[18rem] my-6 bg-white bg-opacity-5 rounded-lg border-2 border-dashed border-[#505050]"></div> */}
      <Dragger
        accept=".csv"
        // action="http://127.0.0.1:8000/api/files/"
        customRequest={handleFileUpload}
        maxCount={1}
        listType="text"
        showUploadList={false}
        className="group w-[18rem] mt-6 rounded-lg"
      >
        <FileAddOutlined className="text-[#919191] text-4xl group-hover:text-[#ffffffb7]" />

        <p className="text-[#919191] group-hover:text-[#ffffffb7] font-mono mt-4 transition-all">
          Click or drag file to this area to upload
        </p>
      </Dragger>

      {csvfile && (
        <Space
          direction="vertical"
          size={0}
          className="group mt-4 rounded-[5px] cursor-pointer hover:bg-[#ffffff10] transition-all"
        >
          <Space className="w-[18rem] px-1 py-0.5 flex flex-row items-center justify-between">
            <Space>
              <FileOutlined className="text-[#919191]" />
              <Typography className="text-[#919191] text-base">
                {csvfile.name}
              </Typography>
            </Space>
            <Space>
              <DownloadOutlined
                onClick={() => {
                  csvfile.download && window.open(csvfile.download);
                }}
                className="text-[#919191] hover:text-green-500 hover:bg-[#ffffff15] rounded-[2px] p-0.5 text-lg transition-all"
              />
              <DeleteOutlined
                onClick={() => {
                  setCsvfile(undefined);
                  setDone(false);
                }}
                className="text-[#919191] hover:text-red-500 hover:bg-[#ffffff15] rounded-[2px] p-0.5 text-lg transition-all"
              />
            </Space>
          </Space>
          <Progress
            className={`${done ? "hidden" : "flex"}`}
            percent={csvfile.progress * 100}
            showInfo={false}
          />
        </Space>
      )}

      <TextArea
        // value={dispVal}
        placeholder="Custom prompts..."
        disabled={loading}
        onChange={(e) => {
          setUserPrompt(e.target.value);
        }}
        className="chat-input w-[18rem] mt-6 text-white text-opacity-75 text-base font-mono"
        autoSize
      />

      <Button
        onClick={() => {
          done
            ? handleSubmit()
            : message.error("Please upload a file to proceed.");
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
