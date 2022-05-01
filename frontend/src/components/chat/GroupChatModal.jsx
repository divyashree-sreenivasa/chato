import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  useToast,
  FormControl,
  Input,
  Box
} from '@chakra-ui/react'
import { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../user/UserListItem';
import UserBadgeItem from '../user/UserBadgeItem';


const GroupChatModal = ({children}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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

  const handleSubmit = async () => {
    if(!groupChatName || !selectedUsers) {
        toast({
          title: 'Please fill all the fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        });
        return;
    }

    try {

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.post('/api/chat/group/create',
                                     { name: groupChatName,
                                       users: JSON.stringify(selectedUsers.map(u => u._id)) 
                                     },
                                     config);


        setChats([data, ...chats]);
        onClose();
        toast({
          title: 'New group created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        });

    } catch (error) {
        toast({
          title: 'Error',
          description: 'Error creating group chat',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        });
    }
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser._id !== userToDelete._id))
  };

  const handleGroup = (usertoAdd) => {
    if(selectedUsers.includes(usertoAdd)) {
        toast({
          title: 'User already added!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        });
        return;
    }

    setSelectedUsers([...selectedUsers, usertoAdd])
  };

  return (
      <>
        <span onClick={onOpen}>{children}</span>

        <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        d="flex"
                        justifyContent="center"
                        fontFamily="Poppins"
                        letterSpacing="0.5px"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        d="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-around"
                    >
                        <FormControl>
                            <Input placeholder="Chat Name" 
                                mb={3} 
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add Users ex: John, Abby" 
                                mb={1} 
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedUsers.map(user => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                            ))}
                        </Box>
                        {loading? (<div>Loading...</div>) : (
                            searchResults?.slice(0,4).map(user => {
                                return <UserListItem key={user._id} 
                                    user={user} 
                                    handleFunction={() => handleGroup(user)}/>
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
      
      </>
    
  )
}

export default GroupChatModal