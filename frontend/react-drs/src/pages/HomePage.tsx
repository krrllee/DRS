import React, { useState, useEffect } from "react";
import HttpClient from "./HttpClient";
import {
  Center,
  Text,
  Heading,
  VStack,
  Button,
  useDisclosure,
  ChakraProvider,
  Stack,
  Box,
  Grid,
} from "@chakra-ui/react";
import AddModal from "./components/AddModal";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<string>("");

  const logOutUser = async () => {
    await HttpClient.post("//localhost:5000/logout");
    window.location.href = "/";
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await HttpClient.get("//localhost:5000/@me");
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);

  return (
    <ChakraProvider> 
    <Grid templateColumns="repeat(3,1fr)" >
    <VStack alignItems={'center'} justifyContent={'flex-start'}backgroundColor='purple.500'spacing={4} direction='row'>
    <Button height={'100%'} variant='solid' borderRadius='none' size='md' colorScheme='purple' type="button">
        Add transaction
    </Button>
    </VStack>
    <VStack alignItems={'center'} justifyContent={'center'} backgroundColor='purple.500'spacing={4} direction='row'>
    <Heading fontSize='2xl'color='whiteAlpha.900'>Crypto portfolio</Heading>
    </VStack>
    <VStack justifyContent={'flex-end'} backgroundColor='purple.500' spacing={4} direction='row' align='flex-end'>
    <Button variant='solid' borderRadius='none' size='md' colorScheme='purple' type="button">
        Edit user info
    </Button>
      <Button variant='solid' borderRadius='none' size='md' colorScheme='purple' type="button" onClick={() => logOutUser()}>
        Logout
      </Button>
    </VStack>
    </Grid>
    
    </ChakraProvider>
  );
};

export default HomePage;
