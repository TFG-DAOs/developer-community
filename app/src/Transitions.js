import React from "react";
import {
  Button,
  IconCross,
  TextInput,
  SidePanel,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Text,
  Card
} from "@aragon/ui";
import styled from "styled-components";
import { toHex } from "web3-utils";

export const Transitions = ({
  perfilActivo,
  transitions,
  transitionsActivas,
  transitionsExist,
  handleRemoveTransition,
}) => (
  <patata>
    {transitionsExist ? (
      <Table
    header={
      <TableRow>
        <TableHeader title="TRANSICIONES" />
      </TableRow>
    }
  >
      <TableRow>
        <TableCell>
              <Text>FINAL PROFILE</Text>
            </TableCell><TableCell>
              <Text>TIME CONDITON</Text>
            </TableCell><TableCell>
              <Text>CONTRIBUTION CONDITION</Text>
            </TableCell>
      </TableRow>
      <TableRow>

        {transitionsActivas.map(tr => (
          <div>
            <TableCell>
              <Text>{tr.finalProfile}</Text>
            </TableCell>
            <TableCell>
              <Text>{transitions[tr.hash].timeCondition}</Text>
              
            </TableCell>
            
            <TableCell>
               
              <Text>{transitions[tr.hash].contributionCondition}</Text>
              
            </TableCell>
            <TableCell>
            <Button   onClick={() => {
                    handleRemoveTransition(tr.hash,perfilActivo);
                  }}
                >
                  <IconCross />
                </Button>
              </TableCell>
          </div>
        ))}
      </TableRow>
      </Table>
    ) : (
      <Text> NO HAY TRANSICIONES A OTROS PERFILES</Text>
    )}
  
  </patata>
);
