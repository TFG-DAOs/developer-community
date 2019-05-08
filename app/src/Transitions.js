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
  AppView,
  IconSettings,
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
  setSidePanelTitle,
  setFinalProfileConditions
}) => (
    <AppView style={{height: "auto"}}title={perfilActivo.toUpperCase()}>
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
                <Text>SETTINGS</Text>
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
              <TableCell> <Button onClick={() => {
                  setActiveAddProfile(false)
                  setMode('Conditions')
                  setSidePanelTitle('Change Conditions')
                  setFinalProfileConditions(toHex(finalProfile))
                  setOpened(true)
                }}
                ><IconSettings /></Button>
              <Button onClick={() => {
                  handleRemoveTransition(toHex(perfilActivo), toHex(finalProfile))}}
                ><IconCross /></Button>
             
              </TableCell>
            </TableRow>
          ))}   
        </Table>
      ) : (
          <Text> THERE ARE NO TRANSITIONS TO OTHER PROFILES</Text>
        )}

      <Button mode="strong" style={{textAlign: "center", width: "15%", marginTop:"2%"}}onClick={() => {
        setActiveAddProfile(false)
        setMode('Transitions')
        setSidePanelTitle('New Transition')
        setOpened(true)
      }}>Add Transition</Button>
      
     
     
      

    
    </AppView>
  );

 
  const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  margin-top: 20px;
`;