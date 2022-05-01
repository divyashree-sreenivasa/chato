import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../user/UserBadgeItem";
import UserListItem from "../user/UserListItem";

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleRemoveUserFromGroup = async (userToRemove) => {
      if(selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
          toast({
          title: 'Only group admins can add someone!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        });
        return;
      }

      try {
        setLoading(true);

        const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          }

          const { data } = await axios.put(`/api/chat/group/removeuser`, {
            chatId: selectedChat._id,
            userId: userToRemove._id
          }, config);

          userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          fetchMessages();
          setLoading(false);
    } catch (error) {
        toast({
          title: 'Error!',
          description: "Error removing user from group",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        });
    }
  };

  const handleGroupRename = async () => {
    if(!groupChatName) return;
    try {
        setRenameLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.put('/api/chat/group/rename', {
            chatId: selectedChat._id,
            chatName: groupChatName
        }, config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);

    } catch (error) {
        toast({
          title: 'Error',
          description: error.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        });
        setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if(!query) return;
    try {
        setLoading(true);

        const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          }

          const { data } = await axios.get(`/api/user?search=${query}`, config);
          setLoading(false);
          setSearchResults(data);

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
  };    

  const handleAddUserToGroup = async (userToAdd) => {
    if(selectedChat.users.find((u) => u._id === userToAdd._id)) {
        toast({
          title: 'User already in group!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        });
        return;
    }

    if(selectedChat.groupAdmin._id !== user._id) {
        toast({
          title: 'Only group admins can add someone!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        });
        return;
    }

    try {
        setLoading(true);

        const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`
              }
          }

          const { data } = await axios.put("/api/chat/group/adduser", {
            chatId: selectedChat._id,
            userId: userToAdd._id
          }, config);

          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setLoading(false);

    } catch (error) {
        toast({
          title: 'Error!',
          description: "Error adding user to group",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        });
    }
  }

  return (
    <>
        <IconButton d="flex" icon={<FaChevronDown/>} onClick={onOpen} />

        <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        d="flex"
                        justifyContent="center"
                        fontFamily="Poppins"
                        letterSpacing="0.5px"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        d="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-around"
                    >
                        <Text alignSelf="start" mb={3}><b>Group Admin: </b>{selectedChat.groupAdmin.name}</Text>
                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedChat.users.map(user => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemoveUserFromGroup(user)} />
                            ))}
                        </Box>

                        <FormControl d="flex">
                            <Input placeholder="Chat Name" 
                                mb={3} 
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="blue"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleGroupRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add Users ex: John, Abby" 
                                mb={1} 
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        
                        {loading? (
                            <Spinner size="lg" />
                        ) : (
                            searchResults?.slice(0,4).map(user => (
                                <UserListItem 
                                    key={user._id} 
                                    user={user} 
                                    handleFunction={() => handleAddUserToGroup(user)}/>
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" onClick={() => handleRemoveUserFromGroup(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
      
    </>
  )
}

export default UpdateGroupModal