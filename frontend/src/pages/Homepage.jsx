import { Container, Box, Text } from "@chakra-ui/react"
import { Tabs, 
         TabList, 
         TabPanels, 
         Tab, 
         TabPanel 
       } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Login from '../components/auth/Login'
import Signup from '../components/auth/Signup'

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if(userInfo) {
        navigate('/chats');
    }
  }, [navigate]);

  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        >
        <Text fontSize="4xl" fontFamily="Poppins" color="black">Chat-O</Text>
      </Box> 
      <Box bg={"white"} w="100%" p={4} borderRadius="lg" borderWidth="1px" color="black">
        <Tabs>
          <TabList mb={1}>
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
        
      </Box> 
    </Container>
  )
}

export default Home