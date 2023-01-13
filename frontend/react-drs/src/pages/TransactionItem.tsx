import React, { useState, useEffect } from "react";
import HttpClient from "./HttpClient";
import { Tr, Td, Button, Hide } from "@chakra-ui/react";

export default function TransactionItem({ transaction }: { transaction: any }) {
  const[id,setId] = useState();

  const deleteTransaction = (id:any) => {
    console.log(id)
    HttpClient.post("//localhost:5000/delete_transactions",{
      id:id
    }).then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
    window.location.href = "/home";
  };
  

  return (
    <Tr>
      
      <Td>{transaction["coin_name"]}</Td>
      <Td>{transaction["coin_symbol"]}</Td>
      <Td isNumeric>$ {transaction["amount"].toLocaleString()}</Td>
      <Td isNumeric>{transaction["no_of_coins"]}</Td>
      <Td isNumeric>$ {transaction["price_purchased_at"].toLocaleString()}</Td>
      <Td isNumeric>{transaction["time_transacted"]}</Td>
      <Td key={transaction["id"]}>
       <Button onClick={() => deleteTransaction(transaction["id"])}>Delete</Button>
      </Td>
    </Tr>
  );
}
