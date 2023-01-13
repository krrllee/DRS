import React, { useState, useEffect } from "react";
import HttpClient from "./HttpClient";
import TransactionItem from "./TransactionItem";
import TransactionsTable from "./TransactionTable";
import {
  Center,
  HStack,
  Container,
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

import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const [transactions, setTransactions] = useState([]);
  const [portfolioCost, setPortfolioCost] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [absoluteGain, setAbsoluteGain] = useState(0);
  const [totalGainPercent, setTotalGainPercent] = useState(0);
  const [rollups, setRollups] = useState([]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#F28042",
    "#9fd3c7",
    "#142d4c",
    "#feff9a",
    "#ffb6b9",
    "#fae3d9",
    "#bbded6",
    "#61c0bf",
  ];

  const logOutUser = async () => {
    await HttpClient.post("//localhost:5000/logout");
    window.location.href = "/";
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await HttpClient.get("//localhost:5000/@me");
        console.log(resp.data);
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }

      try {
        const resp = await HttpClient.get("//localhost:5000/all_transactions");

        setTransactions(resp.data);
        console.log(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }

      try {
        const resp = await HttpClient.get("//localhost:5000/get_crypto");
        if (resp && resp.data) {
          console.log(resp.data);
          setRollups(resp.data);
          const data = resp.data;

          let costAccumulator = 0;
          let valueAccumulator = 0;
          data.forEach((item: any) => {
            costAccumulator += item["total_cost"];
            valueAccumulator += item["total_equity"];
          });

          let absoluteGain = valueAccumulator - costAccumulator;
          setPortfolioCost(costAccumulator);
          setPortfolioValue(valueAccumulator);
          setAbsoluteGain(absoluteGain);
          setTotalGainPercent((absoluteGain / costAccumulator) * 100);
        } else {
          console.log("Error: Invalid response from server.");
        }
      } catch (error) {
        console.log("Error: Failed to fetch data from server.");
      }
    })();
  }, []);

  return (
    <ChakraProvider>
      <Grid templateColumns="repeat(3,1fr)">
        <VStack
          alignItems={"center"}
          justifyContent={"flex-start"}
          backgroundColor="purple.500"
          spacing={4}
          direction="row"
        >
          <a href="/addTransaction">
            <Button
              height={"100%"}
              variant="solid"
              borderRadius="none"
              size="lg"
              colorScheme="purple"
              type="button"
            >
              Add transaction
            </Button>
          </a>
        </VStack>
        <VStack
          alignItems={"center"}
          justifyContent={"center"}
          backgroundColor="purple.500"
          spacing={4}
          direction="row"
        >
          <Heading fontSize="2xl" color="whiteAlpha.900">
            Crypto portfolio
          </Heading>
        </VStack>
        <VStack
          justifyContent={"flex-end"}
          backgroundColor="purple.500"
          spacing={4}
          direction="row"
          align="flex-end"
        >
          <a href="/edit">
            <Button
              variant="solid"
              borderRadius="none"
              size="md"
              colorScheme="purple"
              type="button"
            >
              Edit user info
            </Button>
          </a>
          <Button
            variant="solid"
            borderRadius="none"
            size="md"
            colorScheme="purple"
            type="button"
            onClick={() => logOutUser()}
          >
            Logout
          </Button>
        </VStack>
      </Grid>
      <HStack spacing={6} marginTop="5">
        <Container bg="gray.400">
          <VStack width={20}>
            <Text fontSize="2xl">
              ${Number(portfolioCost.toFixed(2)).toLocaleString()}
            </Text>
            <Text fontSize="xs" size="md">
              Portfolio Cost
            </Text>
          </VStack>
        </Container>
        <Container bg="gray.200">
          <VStack width={40}>
            <Text fontSize="2xl">
              ${Number(portfolioValue.toFixed(2)).toLocaleString()}
            </Text>
            <Text fontSize="xs">Portfolio Value</Text>
          </VStack>
        </Container>
        <Container bg="gray.400">
          <VStack width={40}>
            <Text fontSize="2xl">
              $ {Number(absoluteGain.toFixed(2)).toLocaleString()}
            </Text>
            <Text fontSize="xs"> Absolute Gain / Loss </Text>
          </VStack>
        </Container>
        <Container bg="gray.200">
          <VStack width={40}>
            <Text fontSize="2xl">{totalGainPercent.toFixed(2)} %</Text>
            <Text fontSize="xs">Gain / Loss %</Text>
          </VStack>
        </Container>
      </HStack>
      <Center marginTop="10">
        <VStack>
          <Text>Cost vs Equity</Text>
          <BarChart
            width={600}
            height={300}
            data={rollups}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
           <XAxis dataKey="symbol" /> 
           <YAxis />
           <Tooltip />
           <Legend />
           <Bar dataKey="total_equity" fill="#00C49F" />
           <Bar dataKey="total_cost" fill="#FFBB28" />
          </BarChart>

          <HStack>
            <VStack>
            <Text>Cost Distribution</Text>
            <PieChart width={250} height={250}></PieChart>
            <Pie data={rollups} dataKey="total_cost" nameKey="symbol">
                {rollups.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend></Legend>
              <Tooltip></Tooltip>
            </VStack>
            <VStack>
            <Text>Equity Distribution</Text>
            <PieChart width={250} height={250}>
              <Pie data={rollups} dataKey="total_equity" nameKey="symbol">
                {rollups.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend></Legend>
              <Tooltip></Tooltip>
            </PieChart>
          </VStack>
          </HStack>
        </VStack>
      </Center>
      <TransactionsTable transactions={transactions}></TransactionsTable>
    </ChakraProvider>
  );
};

export default HomePage;
