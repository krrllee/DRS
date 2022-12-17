import React, { useState,useEffect } from "react";
import HttpClient from "./HttpClient";
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

const EditUserPage = () => {
  const [username, setUsername] = useState<string>("");
  const [first_name, setFirstName] = useState<string>("");
  const [last_name, setLastName] = useState<string>("");
  const [adress, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [phone_number, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const editUser = async () => {
    try {
      const resp = await HttpClient.post("http://127.0.0.1:5000/change_personal_info", {
        id:user[0],
        username,
        first_name,
        last_name,
        adress,
        city,
        state,
        phone_number,
        email,
        password,
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
        const resp = await HttpClient.get("//localhost:5000/@me");
        console.log(resp.data)
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
            Change your informations
          </Heading>
          <FormControl>
            <Grid templateColumns="repeat(2,1fr)" gap={5} marginTop="15px">
              <Grid templateColumns="repeat(2,1fr)" gap={2} marginTop="15px">
                <FormLabel>Username</FormLabel>
                <Input
                  
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <FormLabel>First name</FormLabel>
                <Input
                  placeholder="first name"
                  type="text"
                  value={first_name}
                  onChange={(event) => setFirstName(event.target.value)}
                />
                <FormLabel>Last name</FormLabel>
                <Input
                  placeholder="last name"
                  type="text"
                  value={last_name}
                  onChange={(event) => setLastName(event.target.value)}
                />
                <FormLabel>Address</FormLabel>
                <Input
                  placeholder="address"
                  type="text"
                  value={adress}
                  onChange={(event) => setAddress(event.target.value)}
                />
                <FormLabel>City</FormLabel>
                <Input
                  placeholder="city"
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </Grid>
              <Grid templateColumns="repeat(2,1fr)" gap={2} marginTop="15px">
                <FormLabel>State</FormLabel>
                <Input
                  placeholder="state"
                  type="text"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                />
                <FormLabel>Phone number</FormLabel>
                <Input
                  placeholder="phone number"
                  type="text"
                  value={phone_number}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                />
                <FormLabel>Email</FormLabel>
                <Input
                  readOnly
                  placeholder="email"
                  type="text"
                  value={user[1]}
                  
                />
                <FormLabel>Password</FormLabel>
                <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Grid>
            </Grid>
            <Stack justify="space-between" marginTop="50px">
              <Button
                colorScheme="purple"
                variant="solid"
                type="button"
                onClick={() => editUser()}
              >
                Submit changes
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

export default EditUserPage;
