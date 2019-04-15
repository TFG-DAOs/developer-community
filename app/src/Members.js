import React from "react";
import {
    IdentityBadge,
    AppView,
    Button,
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
    {Object.keys(members).filter(m => (members[m].profile == activeProfile)).map( member => (
      <Buttons>
      <IdentityBadge entity={member} customLabel="true"/>

       <Button mode = "outline" style={{marginLeft: "2%" , alignContent: "center"}} onClick={() => {
         setGoUp(true);
         setMember(member);
         
      }}>Assign
      </Button>
      </Buttons>
    ))}
    </AppView>
  );

  const Buttons = styled.div`
  align-items: center;
    align-content: center;
    justify-content: center;
    display: flex;
    margin-top: 2%;
`;