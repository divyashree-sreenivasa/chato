import { Box, Button, Stack, useToast, Text } from '@chakra-ui/react';
import {ChatState} from '../../context/ChatProvider';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { getSender } from '../../config/ChatLogic';
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setloggedUser] = useState('');
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
      try {
          const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          }

          const { data } = await axios.get("/api/chat", config);
          setChats(data);

      } catch (error) {
          toast({
          title: 'Error: Failed to load the chats',
          description: 'Failed to load the chats',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        });
      }
  }

  useEffect(() => {
    setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain])

  return (
    <Box
        d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "30%" }}
        borderRadius="lg"
        borderWidth="1px"
    >
        <Box
            d="flex"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            pb={3}
            px={3}
            fontSize={{ base: "18px", md:"20px" }}
            fontFamily="Poppins"
        >
            My Chats
            <GroupChatModal>
                <Button
                    d="flex"
                    fontSize={{ base: "15px", md: "10px", lg: "15px" }}
                    rightIcon={<FaPlus />}
                >
                    New Group Chat
                </Button>
            </GroupChatModal>
        </Box>

        <Box
            d="flex"
            flexDir="column"
            p={3}
            bg="#F8F8F8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
        >
            {chats ? (
                <Stack overflowY="scroll"> 
                    {
                        chats.map((chat) => (
                            <Box onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "blue.100" : "e8e8e8"}
                                color="black"
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                                _hover={{ bg: "blue.100"}}
                            >
                                <Text>
                                    {!chat.isGroupChat? ( 
                                        getSender(loggedUser, chat.users)
                                    ) : chat.chatName}
                                </Text>
                                {chat.latestMessage && (
                                    <Text fontSize="xs">
                                        {/* <b>{chat.latestMessage.sender.name}: </b> */}
                                        {chat.latestMessage.content.length > 50
                                        ? chat.latestMessage.content.substring(0, 51) + "..."
                                        : chat.latestMessage.content}
                                    </Text>
                                )}
                            </Box>
                        ))
                    }
                </Stack>
            ) : (
                <ChatLoading />
            )}
        </Box>
    </Box>
  )
}

export default MyChats