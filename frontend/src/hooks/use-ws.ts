import { useEffect, useState, useRef } from "react";
import { WS_URL } from "../lib/config";

const useWs = () => {
  const [newImageTrigger, setNewImageTrigger] = useState<boolean>(false);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onmessage = (event: MessageEvent) => {
      if (event.data === "new image") setNewImageTrigger(!newImageTrigger);
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  return { newImageTrigger };
};

export default useWs;
