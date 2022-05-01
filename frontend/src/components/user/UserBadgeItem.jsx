import { Badge, Text } from "@chakra-ui/react"
import {AiOutlineClose} from 'react-icons/ai'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      d="flex"
      alignItems="center"
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="green"
      cursor="pointer"
      onClick={handleFunction}
    >
      <Text mr="10px">{user.name}</Text>
      {/* {admin === user._id && <span> (Admin)</span>} */}
      <AiOutlineClose style={{color: "white"}} />
    </Badge>
  )
}

export default UserBadgeItem