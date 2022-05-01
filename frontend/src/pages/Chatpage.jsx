import { ChatState } from "../context/ChatProvider";
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/chat/SideDrawer';
import MyChats from '../components/chat/MyChats';
import ChatBox from '../components/chat/ChatBox';
import { useState } from "react";

const Chat = () => {
  const {user} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width: "100%"}}>
        { user && <SideDrawer /> }
        <Box
          d='flex'
          justifyContent='space-between'
          w="100%"
          h="90vh"
          p="20px">
          { user && <MyChats fetchAgain={fetchAgain} /> }
          { user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> }
        </Box>
    </div>
  )
}

export default Chat