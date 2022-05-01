import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from "@chakra-ui/react"
import { useState } from "react"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Login = () => {

  const [show, setShow] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleShow = () => setShow(!show)

  const toast = useToast()
  const navigate = useNavigate()

  const onSubmit = async () => {
      setLoading(true)
      if (!email || !password) {
          toast({
          title: 'Please fill all the required fields!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })
        setLoading(false)
        return
      }
      
      try {
          const config = {
              headers: {
                  "content-type": "application/json",
              }
          }
          const {data} = await axios.post("/api/user/login", {
              email, 
              password,
          }, config)

          toast({
          title: 'Login successful',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })

        localStorage.setItem('userInfo', JSON.stringify(data))
        setLoading(false)
        navigate('/chats')
      } catch (error) {
          toast({
          title: 'Error Occured',
          description: error.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })
        setLoading(false)
      }
  }

  return (
    <VStack spacing="5px" color='black'>

        <FormControl id='login-email' isRequired my={3}>
            <FormLabel>Email</FormLabel>
            <Input type={"email"} value={email} placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
        </FormControl>

        <FormControl id='login-password' isRequired my={3}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show ? "text" : "password"}  value={password} placeholder='Choose Your Password' onChange={(e) => setPassword(e.target.value)} />
                <InputRightElement w={"4.5rem"}>
                    <Button h={"1.75rem"} size="sm" onClick={toggleShow}>
                        {show ? "Hide" : "Show"}    
                    </Button>    
                </InputRightElement>
            </InputGroup>
            
        </FormControl>

        <Button 
            colorScheme="blue"
            w="100%"
            style={{ marginTop: 30 }}
            mt={4}
            onClick={onSubmit}
            isLoading={loading}
        >
            Login
        </Button>

        <Button 
            colorScheme="green"
            w="100%"
            style={{ marginTop: 15 }}
            onClick={() => {
                setEmail("guest@gmail.com")
                setPassword("hello123")
            }}
        >
            Get guest user credentials
        </Button>

    </VStack>
  )
}

export default Login