import React, { useEffect, useState, useContext } from "react";
import {
  Layout,
  Input,
  Space,
  Typography,
  Spin,
  Skeleton,
  message,
} from "antd";
import {
  SendOutlined,
  CrownFilled,
  UserOutlined,
  SyncOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import logo from "../Assets/liama.png";
import logoBW from "../Assets/liama.png";
import axios from "axios";
import { GlobalContext } from "../Context/GlobalContext";

const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;

export default function Chat() {
  const [dispVal, setDispVal] = useState<any>();
  // const [query, setQuery] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [messagesOld, setMessagesOld] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { uploaded, setUploaded, text, setText, userPrompt, url } =
    useContext(GlobalContext);

  useEffect(() => {
    const loadingElem = document.getElementById("chat-loading");
    if (loadingElem)
      loadingElem.scrollIntoView({
        behavior: "smooth",
      });
  }, [loading]);

  useEffect(() => {
    if (uploaded) {
      // console.log(uploaded);
      let query = "Rspond with site name and a welcome message like : Hi how can i help you today.";
      handleQuery(query);
    }
  }, [uploaded]);

  const getAnswer = (query: string) => {
    let convo = chat;
    let messages = messagesOld;
    const element = document.getElementById("chat-bottom");
    //@ts-ignore
    element.scrollIntoView("smooth");
    const data = JSON.stringify({
      query: query,
    });
    console.log(data);
    axios
      .post("http://localhost:8000/api/chat/getAnswer/", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        console.log(response);
        // console.log(response.data);
        if (response.data.answer === "false") {
          setTimeout(() => {
            console.log("Pinging for answer...")
            getAnswer(query);
          }, 2000);
        } else {
          messages = messages.concat([
            { role: "assistant", content: response.data.answer },
          ]);
          setMessagesOld(messages);
          // console.log("ooooooooo", messages);
          setTimeout(() => {
            convo = convo.concat([response.data.answer]);
            setChat(convo);
            setLoading(false);
            //@ts-ignore
            element.scrollIntoView({
              behavior: "smooth",
            });
          }, 500);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleQuery = (query: string) => {
    setLoading(true);
    console.log("Query : ", query);
    let convo = chat;
    let messages = messagesOld.concat([{ role: "user", content: query }]);
    if (query !== "") {
      convo = convo.concat([query]);
      setChat(convo);
      // setQuery("");
      const element = document.getElementById("chat-bottom");
      //@ts-ignore
      element.scrollIntoView("smooth");
      // const data = JSON.stringify({
      //   messages: messages,
      // });
      const data = JSON.stringify({
        query: query,
        url: url,
      });
      console.log(data);
      axios
        .post("http://localhost:8000/api/chat/queries/", data, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          // console.log(response.data);
          console.log(response.data.received);
          if (response.data.received) {
            setTimeout(() => {
              getAnswer(query);
            }, 1000);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center font-inter">
      <Layout className="w-full relative">
        <div className="sticky top-0 h-fit z-10 bg-[#202123] flex items-center p-2 text-2xl font-bold font-mono text-white border-b-2 border-[#505050]">
          <img src={logo} className="w-10 h-10 mx-2" />
          trana
        </div>
        <Content className="max-w-[100vw] overflow-y-auto bg-[#202123] flex flex-col gap-4 items-center pt-6">
          {chat.map((chat, index) => (
            <div
              key={index}
              className={`w-[85%] md:w-[90%] max-w-[55rem] relative flex-row items-start ${
                index % 2 === 0 ? "justify-end" : "justify-start"
              }
              ${index === 0 ? "hidden" : "flex"}
              `}
            >
              <div
                className={`w-fit flex flex-col gap-2 ${
                  index % 2 === 0 ? "items-end" : "items-start"
                }`}
              >
                {index % 2 !== 0 && (
                  <div className="flex items-end gap-2">
                    <img src={logoBW} className="w-6 h-6" />
                    <span className="text-white text-opacity-80">Trana</span>
                  </div>
                )}
                {index % 2 === 0 && (
                  <div className="flex items-end gap-2">
                    <span className="text-white text-opacity-80">User</span>
                    <UserOutlined className="bg-[#919191] w-6 h-6 flex justify-center text-black text-opacity-60 text-[1.7rem] rounded-full p-1" />
                  </div>
                )}
                <Typography
                  className={`text-white p-2 ${
                    index % 2 === 0
                      ? "bg-[#233556] rounded-[10px] "
                      : "bg-[#313131] rounded-[10px] "
                  } whitespace-pre-wrap text-opacity-90 text-base font-inter tracking-wider`}
                >
                  {chat}
                </Typography>
              </div>
              <div
                className={`ml-2 gap-5 md:gap-3 pt-4 flex flex-col items-start ${
                  index % 2 === 0 ? "hidden" : "flex"
                }`}
              >
                <CopyOutlined
                  onClick={() => {
                    navigator.clipboard.writeText(chat);
                    message.success("Copied to clipboard.");
                  }}
                  className="text-lg text-[#919191] hover:text-[#cccccc] transition-all cursor-pointer"
                />
                <SyncOutlined className="text-lg text-[#919191] hover:text-[#cccccc] transition-all cursor-pointer" />
              </div>
            </div>
          ))}
          {loading && (
            <div
              id="chat-loading"
              className="w-[90%] max-w-[55rem] gap-4 px-4 py-5 flex flex-row items-star bg-[#313131] rounded-[10px]"
            >
              <img src={logoBW} className="w-10 h-10 " />
              <Skeleton active />
            </div>
          )}
        </Content>
        <div id="chat-bottom" className="min-h-[1rem] bg-[#202123]"></div>
        <Footer className="sticky bottom-0 h-24 flex justify-center bg-[#202123]">
          <div className="w-[90%] max-w-[50rem] flex flex-row items-end gap-4 h-fit absolute bottom-7">
            <TextArea
              id="chat-input-box"
              value={dispVal}
              placeholder="Ask a query..."
              disabled={loading}
              onChange={(e) => {
                setDispVal(e.target.value);
                // setQuery(e.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  setDispVal(undefined);
                  //@ts-ignore
                  handleQuery(document.getElementById("chat-input-box")?.value);
                }
              }}
              className="chat-input text-white text-opacity-75 text-lg font-mono"
              autoSize
            />
            <SendOutlined
              disabled={loading}
              onClick={() => {
                setDispVal(undefined);
                //@ts-ignore
                handleQuery(document.getElementById("chat-input-box")?.value);
              }}
              className="bg-[#919191] hover:bg-[#ffffffb7] text-black text-[1.7rem] mb-0.5 rounded-[10px] p-1 cursor-pointer"
            />
          </div>
        </Footer>
      </Layout>
    </div>
  );
}
