import React, { useState, useEffect } from "react";
import HttpClient from "./HttpClient";
import TransactionItem from "./TransactionItem";
import TransactionsTable from "./TransactionTable";
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
  Tr,
  Td,
  Th,
  TableCaption,
  Table,
  Thead,
  Tbody,
} from "@chakra-ui/react";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const [transactions,setTransactions] = useState([]);

  const logOutUser = async () => {
    await HttpClient.post("//localhost:5000/logout");
    window.location.href = "/";
  };

  

  useEffect(() => {
    (async () => {
      try {
        const resp = await HttpClient.get("//localhost:5000/@me");
        console.log(resp.data)
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }

      try {
        const resp = await HttpClient.get("//localhost:5000/all_transactions");
        
        setTransactions(resp.data);
        console.log(resp.data)
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
    
  }, []);


  return (
    <ChakraProvider> 
    <Grid templateColumns="repeat(3,1fr)" >
    <VStack alignItems={'center'} justifyContent={'flex-start'}backgroundColor='purple.500'spacing={4} direction='row'>
    <a href="/addTransaction"><Button height={'100%'} variant='solid' borderRadius='none' size='lg' colorScheme='purple' type="button">
        Add transaction
    </Button></a>
    </VStack>
    <VStack alignItems={'center'} justifyContent={'center'} backgroundColor='purple.500'spacing={4} direction='row'>
    <Heading fontSize='2xl'color='whiteAlpha.900'>Crypto portfolio</Heading>
    </VStack>
    <VStack justifyContent={'flex-end'} backgroundColor='purple.500' spacing={4} direction='row' align='flex-end'>
    <a href="/edit"><Button variant='solid' borderRadius='none' size='md' colorScheme='purple' type="button">
        Edit user info
    </Button>
    </a>
      <Button variant='solid' borderRadius='none' size='md' colorScheme='purple' type="button" onClick={() => logOutUser()}>
        Logout
      </Button>
    </VStack>
    </Grid>
    <TransactionsTable transactions={transactions}></TransactionsTable>
    </ChakraProvider>
  );
};

export default HomePage;