import React from "react";
import {
    IdentityBadge,
    AppView,
    Button,
    Table,
    Text,
    TableRow,
    TableCell,
    IconSettings
} from "@aragon/ui";
import { toHex } from "web3-utils";
import styled from "styled-components";

export const Members = ({
    members,
    activeProfile,
    setMember,
    setGoUp,

  }) => (
    <AppView style={{display:"flex", justifyContent:"center"}}title = "MEMBERS">
    <Table
      header={
        <TableRow>
              <TableCell>
                <Text>ADDRESS</Text>
              </TableCell>
              <TableCell>
                <Text>CREATION TIME</Text>
              </TableCell>
              <TableCell>
                <Text>CONTRIBUTIONS</Text>
              </TableCell>
              <TableCell>
                <Text>ASSIGN</Text>
              </TableCell>
            </TableRow>
      }
    >
      {Object.keys(members).filter(m => (members[m].profile == activeProfile)).map( member => (
        <TableRow>
          <TableCell>
            <IdentityBadge entity={member} customLabel="true"/>
          </TableCell>
          <TableCell>
            <Text>{members[member].creationDate}</Text>
          </TableCell>
          <TableCell>
            <Text>{members[member].contributions}</Text>
          </TableCell>
          <TableCell>
            <Button mode = "outline" style={{ alignContent: "center"}} onClick={() => {
              setGoUp(true);
              setMember(member); 
            }}>Assign
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </Table>
    </AppView>
  );

  const Buttons = styled.div`
  align-items: center;
    align-content: center;
    justify-content: center;
    display: flex;
    margin-top: 2%;
`;