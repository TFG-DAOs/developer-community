import React from "react";
import { useState } from "react";

import { useAragonApi } from "@aragon/api-react";
import {
  Main,
  Button,
  TextInput,
  TabBar,
  Card,
  SidePanel,
  IconCross
} from "@aragon/ui";
import SideBar from "./SideBar";
import styled from "styled-components";
import { toHex } from "web3-utils";
function App() {
  /*
  api contiene todos los metodos del contrato
  appState es el estado que devuelve la ultima funcion redux que se ha ejecutado.
  */
  let _profile;
  const { api, appState } = useAragonApi();
  const { profiles, syncing } = appState;
  const [opened, setOpened] = useState(false);

  const open = new Boolean(false);

  return (
    <Main>
      <BaseLayout>
        {syncing && <Syncing />}

        <Card style={{ height: "100%", width: "300px" }}>
          <CardContent>
            <ul>
              {profiles.map(profile => (
                <li key={profile}>
                  {profile}
                  <Button

                    onClick={() => {
                      api.removeProfile(toHex(profile));
                    }}
                  >
                    <IconCross />
                  </Button>
                </li>
              ))}
            </ul>
            <Button mode="strong" onClick={() => setOpened(true)}>
              New profile
            </Button>
          </CardContent>
        </Card>

        <Button onClick={() => {
          api.addTransition(toHex("aa"), toHex("ss"), 1, 10);
        }}
        >Add Transition
        </Button>
      </BaseLayout>
      <SidePanel title="New Profile" opened={opened} onClose={() => setOpened(false)}>
        <SidePanelContent>
          <TextInput placeholder="Profile Name" ref={input => (_profile = input)} />
          <Button
            style={{ height: "40PX", marginleft: "" }}
            mode="secondary"
            onClick={() => {
              api.addProfile(toHex(_profile.value));
            }}
          >
            Add profile
        </Button>
        </SidePanelContent>
      </SidePanel>

    </Main>
  );
}

const BaseLayout = styled.div`
  display: flex;

  height: 100vh;
  flex-direction: row;
`;

const SidePanelContent = styled.div`
  margin-top:100px;
  display: flex;
  flex-direction: column;
`
const CardContent = styled.div`
  margin-top: 200px;
  text-align: center;
`;
const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  margin-top: 20px;
`;

const Syncing = styled.div.attrs({ children: "Syncing…" })`
  position: absolute;
  top: 15px;
  right: 20px;
`;

export default App;
