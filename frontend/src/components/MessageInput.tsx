import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";

export const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  return <div>MessageInput</div>;
};
