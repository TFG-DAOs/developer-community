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
      <TableCell>
            <Text>FINAL PROFILE {console.log("FINAAAAAAAL")}</Text>
          </TableCell><TableCell>
            <Text>TIME CONDITON</Text>
          </TableCell><TableCell>
            <Text>CONTRIBUTION CONDITION</Text>

          </TableCell>
    </TableRow>
    }
  >
        
        {Object.keys(transitions[perfilActivo]).map(initialProfile => (
            
            <TableRow>
            <TableCell>

              <Text>{initialProfile}</Text>

            </TableCell>
            <TableCell>

              <Text>{console.log(transitions[perfilActivo][initialProfile])}{transitions[perfilActivo][initialProfile].timeCondition}</Text>

            </TableCell>
            
            <TableCell>
               
              <Text>{transitions[perfilActivo][initialProfile].contributionCondition}</Text>
              
            </TableCell>
            <TableCell>
            <Button   onClick={() => {
                    handleRemoveTransition(toHex(initialProfile),toHex(perfilActivo))
                    console.log("TRANSITISDIsssssssssss")
                   
                  }}
                >
                  <IconCross />
                </Button>
              </TableCell>
              </TableRow>
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
