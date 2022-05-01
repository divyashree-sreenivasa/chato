import { IconButton, 
         useDisclosure, 
         Button, 
         Image, 
         Text } from "@chakra-ui/react";
import { FaAngleDown } from "react-icons/fa";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

const ProfileModal = ({ user, children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
        {
            children ? <span onClick={onOpen}>{children}</span> : (
                <IconButton
                    d={{ base: "flex" }}
                    icon={<FaAngleDown/>}
                    onClick={onOpen}
                />
            )
        }

        <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent h="410px">
                <ModalHeader
                    d="flex"
                    justifyContent="center"
                    fontFamily="Poppins"
                    letterSpacing="0.5px"
                >
                    {user.name}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    d="flex"
                    flexDir="column"
                    alignItems="center"
                    justifyContent="space-around"
                >
                    <Image
                        borderRadius="full"
                        boxSize="150px"
                        src={user.profileImage}
                        alt={user.name}
                    />
                    <Text
                        fontFamily="Poppins"
                    >
                        {user.email}
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  )
}

export default ProfileModal