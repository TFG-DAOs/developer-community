import React from "react";
import {
    Button,
    TextInput,
    SidePanel,
    Table,
    TableHeader,
    TableCell,
    TableRow,
    Text
  } from '@aragon/ui'
  import styled from "styled-components";
  import { toHex } from "web3-utils";

  export const Transitions=({
    perfilActivo,
    transitions,
  }) => (
    <Table header ={
        <TableRow>
            <TableHeader title="Final Profile"/>
        </TableRow>
    }>
    <TableRow>
      <TableCell>
        <Text> {transitions[perfilActivo]["ss"].timeCondition}</Text>
        
      </TableCell>
    </TableRow>
    
    
    </Table>

    

  )