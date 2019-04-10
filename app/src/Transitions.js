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
  transitionsActivas,
  transitionsExist,
  handleRemoveTransition,
  setActiveAddProfile,
  setOpened
}) => (
  <AppView title= {perfilActivo}>
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
              <Text>FINAL PROFILE {console.log("FINAAAAAAAL")}</Text>
            </TableCell><TableCell>
              <Text>TIME CONDITON</Text>
            </TableCell><TableCell>
              <Text>CONTRIBUTION CONDITION</Text>
            </TableCell>
      </TableRow>
      

        {transitionsActivas.map(tr => (
          <div>
            {(transitions[tr.hash] !== undefined) ? (
              <TableRow>
            <TableCell>
              <Text>{tr.finalProfile}</Text>
            </TableCell>
            <TableCell>
              <Text>{console.log(transitions[tr.hash])}{transitions[tr.hash].timeCondition}</Text>
              
            </TableCell>
            
            <TableCell>
               
              <Text>{transitions[tr.hash].contributionCondition}</Text>
              
            </TableCell>
            <TableCell>
            <Button   onClick={() => {
                    handleRemoveTransition(tr.hash,perfilActivo)
                    console.log("TRANSITISDIsssssssssss")
                   
                  }}
                >
                  <IconCross />
                </Button>
              </TableCell>
              </TableRow>
              ) : ( <Text> 1</Text>)}
          </div>
        ))}
    
      </Table>
    ) : (
      <Text> NO HAY TRANSICIONES A OTROS PERFILES</Text>
    )}
    <Button mode="strong" onClick={() => {setActiveAddProfile(false)
              setOpened(true)}}>
              Add Transition
            </Button>


  
  </AppView>
);
