import { useState } from 'react';
import { Box, 
    Tooltip, 
    Button, 
    Text, 
    Menu, 
    MenuButton, 
    MenuList, 
    Avatar, 
    MenuItem, 
    MenuDivider, 
    Drawer, 
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Input,
    useToast,
    Spinner,
    effect} from '@chakra-ui/react';
import { FaSearch, FaBell, FaChevronDown } from 'react-icons/fa';
import { ChatState } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal';
import ChatLoading from './ChatLoading';
import UserListItem from '../user/UserListItem';

import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react'
import axios from 'axios';
import { getSender } from '../../config/ChatLogic';
import { Effect } from 'react-notification-badge';
import NotificationBadge from 'react-notification-badge';

const SideDrawer = () => {
    
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const navigate = useNavigate();
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
      localStorage.removeItem("userInfo");
      navigate("/");
  };

  const handleSearch = async () => {
      if(!search) {
        toast({
          title: 'Please enter text to search',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top left'
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

          const { data } = await axios.get(`/api/user?search=${search}`, config);
          setLoading(false);
          setSearchResults(data);

      } catch (error) {
          toast({
          title: 'Error occured',
          description: 'Failed to load the search results',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        });
      }
  }

  const accessChat = async (userId) => {
    try {
        setLoadingChat(true);

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.post('/api/chat', { userId }, config);

        if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

        setSelectedChat(data);
        setLoadingChat(false);
        onClose();

    } catch (error) {
        toast({
          title: 'Error fetching the chat',
          description: 'Error fetching the chat',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        });
    }
  }

  return (
    <>
    <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="10px 5px"
        borderWidth="0px"
    >
        <Tooltip label="Search users you want to chat with" hasArrow placement='bottom-end'>
            <Button variant='ghost' colorScheme="white" onClick={onOpen}>
                <FaSearch/>
                <Text d={{base: "none", md: "flex"}} px="3">
                    Search User
                </Text>
            </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Poppins">
            Chat-O
        </Text>

        <div>
            <Menu>
                <MenuButton p={1}>
                    <NotificationBadge 
                        count={notification.length}
                        effect={Effect.scale}
                    />
                    <FaBell style={{ marginRight: "5px", marginTop: "8px" }} />
                </MenuButton>
                <MenuList px={2}>
                    {!notification.length && "No new messages"}
                    {notification.map((notif) => (
                        <MenuItem key={notif._id} onClick={() => {
                            setSelectedChat(notif.chat);
                            setNotification(notification.filter((n) => n !== notif));
                        }}>
                            {notif.chat.isGroupChat ? `New message in ${notif.chat.chatName}` 
                            : `New message from ${getSender(user, notif.chat.users)}`}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton as={Button} 
                    rightIcon={<FaChevronDown size="8px" />}
                    _hover={{ bg: 'white' }} 
                    bg="white"
                    _expanded={{ bg: 'white' }}
                    _focus={{ bg: 'white' }}
                >
                    <Avatar size="sm" cursor="pointer" name={user.name} src={user.profileImage}></Avatar>                    
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>
                        <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider />
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>

    </Box>

    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
            <Box
                d="flex"
                pb={2}
            >
                <Input 
                    placeholder="Search by name or email"
                    mr={2}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}    
                />
                <Button onClick={handleSearch}>Go</Button>

            </Box>
            {loading ? (
                <ChatLoading />
            ) : searchResults?.map((user) => {
                return <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                />
            })}
            {loadingChat && <Spinner ml="auto" d="flex" />}
        </DrawerBody>
        </DrawerContent>
        
    </Drawer>
    </>
    
  )
}

export default SideDrawer
