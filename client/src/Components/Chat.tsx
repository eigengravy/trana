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
import logo from "../Assets/sensei.png";
import logoBW from "../Assets/senseibw.png";
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

  const { uploaded, setUploaded, text, setText, userPrompt } =
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
      // let prompt = `You have just received a CSV file containing data. The data in the CSV file is as follows: "${text}".You are now the "CSV Sensei", an AI expert in data analysis.
      // Your primary task is to assist the user by providing precise quantitative data insights and answers to their queries regarding the uploaded data.To start the
      // interaction, respond with a welcoming message: "Hi, I am CSV Sensei. How may I assist you today?" Then, provide a summary of the key data points and trends
      // present in the uploaded CSV file. Focus on highlighting valuable insights that can be derived from the data using conventional data science methods and analysis
      // techniques.As you respond to user queries, make sure your answers are insightful, informative, and based on your analysis of the data. Your goal is to provide
      // actionable insights and help the user gain a deeper understanding of the information contained in the CSV file.Remember, your expertise lies in delivering data-driven
      // insights that go beyond a simple copy of the data. Provide valuable answers that empower the user with knowledge they can use to make informed decisions or conclusions
      // about the data.`;
      // let extra = `The user has provided some additional information or analysis preferences as follows "${userPrompt}". Analyze the user's input and
      //  incorporate it into your responses as needed. For example, if the user mentions a specific analysis method they want to be used, acknowledge it and apply the
      //  method in your responses.`;
      // let query = userPrompt && userPrompt.length > 0 ? prompt + extra : prompt;
      let query = "Hi how can i help you today.";
      handleQuery(query);
    }
  }, [uploaded]);

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
      // element.scrollIntoView("smooth");
      // const data = JSON.stringify({
      //   messages: messages,
      // });
      // console.log(data);
      // axios
      //   .post("http://localhost:8000/api/chat/queries/", data, {
      //     headers: {
      //       "Content-Type": "application/x-www-form-urlencoded",
      //     },
      //   })
      //   .then((response) => {
      //     // console.log(response.data);
      //     messages = messages.concat([
      //       { role: "assistant", content: response.data.response },
      //     ]);
      //     setMessagesOld(messages);
      //     // console.log("ooooooooo", messages);
      //     setTimeout(() => {
      //       convo = convo.concat([response.data.response]);
      //       setChat(convo);
      //       setLoading(false);
      //       //@ts-ignore
      //       element.scrollIntoView({
      //         behavior: "smooth",
      //       });
      //     }, 500);
      //   })
      //   .catch((error) => {
      //     setLoading(false);
      //     console.log(error);
      //   });
      messages = messages.concat([
        {
          role: "assistant",
          content: "Hi how can i help you today. Wat ra sudheep!!!",
        },
      ]);
      setMessagesOld(messages);
      // console.log("ooooooooo", messages);
      setTimeout(() => {
        convo = convo.concat([
          "Hi how can i help you today. Wat ra sudheep!!!",
        ]);
        setChat(convo);
        setLoading(false);
        //@ts-ignore
        element.scrollIntoView({
          behavior: "smooth",
        });
      }, 500);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center font-inter">
      <Layout className="w-full relative">
        <div className="sticky top-0 h-fit z-10 bg-[#202123] flex items-center p-2 text-2xl font-bold font-mono text-white border-b-2 border-[#505050]">
          <img src={logo} className="w-10 h-10 mx-2" />
          sensei.csv
        </div>
        <Content className="max-w-[100vw] overflow-y-auto bg-[#202123] flex flex-col items-center pt-6">
          {chat.map((chat, index) => (
            <div
              key={index}
              className={`w-[85%] md:w-[90%] max-w-[55rem] -ml-6 relative flex-row items-start ${
                index % 2 === 0 ? "justify-end" : "justify-start"
              }
              ${index === 0 ? "hidden" : "flex"}
              `}
            >
              <div
                className={`w-fit flex flex-row gap-4 px-2 md:px-4 py-3.5 md:py-5 ${
                  index % 2 === 0 ? "" : "bg-[#313131] rounded-[10px] "
                }`}
              >
                {index % 2 !== 0 && (
                  // <CrownFilled className="bg-[#919191] text-black text-[1.7rem] rounded-[10px] p-1" />
                  <img src={logoBW} className="w-10 h-10 " />
                )}

                <Typography className="text-white whitespace-pre-wrap text-opacity-90 text-base font-inter tracking-wider">
                  {chat}
                </Typography>

                {index % 2 === 0 && (
                  <UserOutlined className="bg-[#919191] w-10 h-10 flex justify-center text-black text-opacity-60 text-[1.7rem] rounded-full p-1" />
                )}
              </div>
              <div
                className={`ml-2 gap-5 md:gap-3 pt-3.5 md:pt-5 flex flex-col items-start ${
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
