import React, { useState } from "react";
import httpClient from "./HttpClient";
import { ChakraProvider, Center, Stack, Button, Input } from "@chakra-ui/react";
import { AtSignIcon, LockIcon } from "@chakra-ui/icons";
import { Box, VStack, Heading } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const logInUser = async () => {
    try {
      console.log(email, password);

      const resp = await httpClient.post("//localhost:5000/login", {
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
            Login
          </Heading>
          <FormControl>
            <FormLabel marginTop="15px">Email</FormLabel>
            <Stack justify="space-between" marginBottom="10px">
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Stack>
            <FormLabel>Password</FormLabel>
            <Stack justify="space-between" marginBottom="10px">
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Stack>
            <Stack justify="space-between" marginTop="10px">
              <Button    
                colorScheme="purple"
                variant="solid"
                type="button"
                onClick={() => logInUser()}
              >
                Login
              </Button>
            </Stack>
          </FormControl>
          <Stack justify="center" color="gray.600" spacing="3">
            <span>Dont have an account?</span>
            <a href="/register">
              <Button colorScheme="purple" variant="link">
                Sign up
              </Button>
            </a>
          </Stack>
        </Stack>
      </Center>
    </ChakraProvider>
  );
};

export default LoginPage;
