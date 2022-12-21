import React, { useState, useEffect } from "react";
import httpClient from "./HttpClient";
import {
  ChakraProvider,
  Center,
  Stack,
  Button,
  Input,
  Grid,
} from "@chakra-ui/react";
import { AtSignIcon, LockIcon } from "@chakra-ui/icons";
import { Box, VStack, Heading } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

const AddTransactionPage: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const [coin_name, setCoinName] = useState("");
  const [coin_symbol, setCoinSymbol] = useState("");
  const [transaction_type, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");
  const [transaction_date, setTransactionDate] = useState("");
  const [price_purchased_at, setPricePurchaseAt] = useState("");
  const [no_of_coins, setNoOfCoins] = useState("");

  const AddTransaction = async () => {
    try {
      const resp = await httpClient.post("//localhost:5000/add_transaction", {
        id: user[0],
        coin_name,
        coin_symbol,
        transaction_type,
        amount,
        time_transacted:Date.parse(transaction_date)/1000,
        time_created:Date.now()/1000,
        price_purchased_at,
  
      });
      window.location.href = "/home";
    } catch (error: any) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("//localhost:5000/@me");
        console.log(resp.data);
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);

  return (
    <ChakraProvider>
      <Center h="100vh" bg="blackAlpha.800">
        <Stack
          boxShadow="md"
          bg="whiteAlpha.900"
          p="20"
          rounded="md"
          marginBottom="10px"
        >
          <Heading as="h1" color="purple.500">
            Add new transaction
          </Heading>
          <FormControl>
            <Grid templateColumns="repeat(2,1fr)" gap={5} marginTop="15px">
              <Grid templateColumns="repeat(2,1fr)" gap={2} marginTop="15px">
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="name"
                  type="text"
                  value={coin_name}
                  onChange={(event) => setCoinName(event.target.value)}
                />
                <FormLabel>Symbol</FormLabel>
                <Input
                  placeholder="symbol"
                  type="text"
                  value={coin_symbol}
                  onChange={(event) => setCoinSymbol(event.target.value)}
                />
                <FormLabel>Transaction Type</FormLabel>
                <Input
                  placeholder="Type [1 = Purchase, 2 = Sell]"
                  type="text"
                  value={transaction_type}
                  onChange={(event) => setTransactionType(event.target.value)}
                />
                <FormLabel>Amount</FormLabel>
                <Input
                  placeholder="amount"
                  type="text"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
                <FormLabel>Transaction date</FormLabel>
                <Input
                  placeholder="Transaction Date (MM-DD-YYYY)"
                  type="text"
                  value={transaction_date}
                  onChange={(event) => setTransactionDate(event.target.value)}
                />
                <FormLabel>Price purchase at</FormLabel>
                <Input
                  placeholder="price purchase at"
                  type="text"
                  value={price_purchased_at}
                  onChange={(event) => setPricePurchaseAt(event.target.value)}
                />
              </Grid>
              
            </Grid>
            <Stack justify="space-between" marginTop="50px">
              <Button
                colorScheme="purple"
                variant="solid"
                type="button"
                onClick={() => AddTransaction()}
              >
                Add new transaction
              </Button>
            </Stack>
          </FormControl>
          <Stack justify="center" color="gray.600" spacing="3">
            <a href="/home">
              <Button colorScheme="purple" variant="link">
                Home page
              </Button>
            </a>
          </Stack>
        </Stack>
      </Center>
    </ChakraProvider>
  );
};

export default AddTransactionPage;
