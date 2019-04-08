import React from "react";
import {
    Button,
    TextInput,
    SidePanel,
    Text
  } from '@aragon/ui'
  import styled from "styled-components";
  import { toHex } from "web3-utils";

export const SideBar = ({
    opened,
    perfilActivo,
    handleAddProfile,
    setOpened,
}) =>(
<SidePanel title="New Profile" opened={opened} onClose={() => setOpened(false)}>
        <SidePanelContent>
        <TextInput placeholder="Profile Name" ref = { input => (perfilActivo = input)} />
          <Button
            style={{ height: "40PX", marginleft: "" }}
            mode="secondary"
            onClick={() => {
              handleAddProfile(perfilActivo.value)
              
              
            }}
          >
            Add profile
        </Button>
        </SidePanelContent>
      </SidePanel>

)

const SidePanelContent = styled.div`
    margin-top:100px;
    display: flex;
    flex-direction: column;
  `
  