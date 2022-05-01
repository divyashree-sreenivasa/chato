import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from "@chakra-ui/react"
import { useState } from "react"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Signup = () => {

  const [show, setShow] = useState(false)
  const [showcp, setShowcp] = useState(false)
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [profileImage, setProfileImage] = useState()
  const [loading, setLoading] = useState(false)

  const toggleShow = () => setShow(!show)
  const toggleShowcp = () => setShowcp(!showcp)

  const toast = useToast()
  const navigate = useNavigate()

  const uploadImage = (image) => {
    setLoading(true)
    if (image === undefined) {
        toast({
          title: 'Please upload an image!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })
        return
    }
    if (image.type === 'image/jpeg' || image.type === 'image/png') {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "chato-app")
        data.append("cloud_name", "dye59cfrn")
        fetch("https://api.cloudinary.com/v1_1/dye59cfrn/image/upload", {
            method: "post",
            body: data
        }).then((res) => res.json())
        .then(data => {
            setProfileImage(data.url.toString())
            setLoading(false)
        })
        .catch (error => {
            console.log(error)
            setLoading(false)
        }) 
    } else {
        toast({
          title: 'Please upload jpeg/png image!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })
    }
  }

  const onSubmit = async () => {
      setLoading(true)
      if (!name || !email || !password || !confirmPassword) {
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
      if (password !== confirmPassword) {
          toast({
          title: 'Passwords do not match',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })
        return
      }
      try {
          const config = {
              headers: {
                  "content-type": "application/json",
              }
          }
          const {data} = await axios.post("api/user", {
              name, 
              email, 
              password,
              profileImage
          }, config)

          toast({
          title: 'Registered successfully',
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
    <VStack spacing="20px" color='black'>
        <FormControl id='name' isRequired mt={3}>
            <FormLabel>Name</FormLabel>
            <Input type={"text"} placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
        </FormControl>

        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input type={"email"} placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show ? "text" : "password"} placeholder='Choose Your Password' onChange={(e) => setPassword(e.target.value)} />
                <InputRightElement w={"4.5rem"}>
                    <Button h={"1.75rem"} size="sm" onClick={toggleShow}>
                        {show ? "Hide" : "Show"}    
                    </Button>    
                </InputRightElement>
            </InputGroup>
            
        </FormControl>

        <FormControl id='confirmPassword' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input type={showcp ? "text" : "password"} placeholder='Confirm Your Password' onChange={(e) => setConfirmPassword(e.target.value)} />
                <InputRightElement w={"4.5rem"}>
                    <Button h={"1.75rem"} size="sm" onClick={toggleShowcp}>
                        {showcp ? "Hide" : "Show"}    
                    </Button>    
                </InputRightElement>
            </InputGroup>
            
        </FormControl>

        <FormControl id='profileImage'>
            <FormLabel>Profile Image</FormLabel>
            <Input type={"file"} p={1.5} accept="image/" onChange={(e) => uploadImage(e.target.files[0])} />
        </FormControl>

        <Button 
            colorScheme="blue"
            w="100%"
            style={{ marginTop: 30 }}
            onClick={onSubmit}
            isLoading={loading}
        >
            Sign Up
        </Button>

    </VStack>
  )
}

export default Signup