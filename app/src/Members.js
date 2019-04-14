import React from "react";
import {
    IdentityBadge,
    AppView
} from "@aragon/ui";
import { toHex } from "web3-utils";

export const Members = ({
    members,
    activeProfile
  }) => (
    <AppView title = "MEMBERS">
    {Object.keys(members).filter(m => (members[m].profile == activeProfile)).map( member => (
        <IdentityBadge entity={member} customLabel="true"/>
    ))}
    </AppView>
  );
