import React from "react";
import {
    IdentityBadge,
    AppView,
    Button,
} from "@aragon/ui";
import { toHex } from "web3-utils";
import styled from "styled-components";

export const Members = ({
    members,
    activeProfile,
    setMember,
    setGoUp,

  }) => (
    <AppView title = "MEMBERS">
    {Object.keys(members).filter(m => (members[m].profile == activeProfile)).map( member => (
      <Buttons>
      <IdentityBadge entity={member} customLabel="true"/>

       <Button mode="strong" onClick={() => {
         setGoUp(true);
         setMember(member);
      }}>Ascend</Button>
      </Buttons>
    ))}
    </AppView>
  );

  const Buttons = styled.div`
  display: grid;
`;