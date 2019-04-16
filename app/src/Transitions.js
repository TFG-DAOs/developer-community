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
  Card,
  AppView
} from "@aragon/ui";
import styled from "styled-components";
import { toHex } from "web3-utils";

export const Transitions = ({
  perfilActivo,
  transitions,
  handleRemoveTransition,
  setActiveAddProfile,
  setOpened,
  setMode,
}) => (
    <AppView title={perfilActivo.toUpperCase()}>
      {transitions[perfilActivo]!== undefined ? (
        <Table
          style = {{width: "100%"}}
          header={
            <TableRow>
              <TableCell>
                <Text>FINAL PROFILE</Text>
              </TableCell>
              <TableCell>
                <Text>TIME CONDITON</Text>
              </TableCell>
              <TableCell>
                <Text>CONTRIBUTION CONDITION</Text>
              </TableCell>
              <TableCell>
                <Text>REMOVE</Text>
              </TableCell>
            </TableRow>
          }
        >
          {Object.keys(transitions[perfilActivo]).map(finalProfile => (
            <TableRow>
              <TableCell>
                <Text>{finalProfile}</Text>
              </TableCell>
              <TableCell>
                <Text>{transitions[perfilActivo][finalProfile].timeCondition}</Text>
              </TableCell>
              <TableCell>
                <Text>{transitions[perfilActivo][finalProfile].contributionCondition}</Text>
              </TableCell>
              <TableCell>
              <Button onClick={() => {
                  handleRemoveTransition(toHex(perfilActivo), toHex(finalProfile))}}
                ><IconCross /></Button>
              </TableCell>
            </TableRow>
          ))}

        </Table>
      ) : (
          <Text> NO HAY TRANSICIONES A OTROS PERFILES</Text>
        )}
        <Buttons>
      <Button mode="strong" onClick={() => {
        setActiveAddProfile(false)
        setMode('Transitions')
        setOpened(true)
      }}>Add Transition</Button>
      <Button mode="strong" onClick={() => {
        setActiveAddProfile(false)
        setMode('Conditions')
        setOpened(true)
      }}>Edit Conditions</Button>
      </Buttons>
      

    
    </AppView>
  );

 
  const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  margin-top: 20px;
`;