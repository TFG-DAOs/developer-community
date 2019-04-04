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
  IconCross,
  DropDown
} from "@aragon/ui";
import SideBar from "./SideBar";
import styled from "styled-components";
import { toHex } from "web3-utils";

function App() {
  /*
  api contiene todos los metodos del contrato
  appState es el estado que devuelve la ultima funcion redux que se ha ejecutado.
  */
  let _profile, _finalPofile, _initialProfile, _timeCondition, _contributionCondition;
  const { api, appState } = useAragonApi();
  const { /*timeCondition, contributionCondition ,*/profiles, syncing } = appState;
  const [opened, setOpened] = useState(false);

  /* <DropDown style={{ height: "40PX", width: "200px" }}
              items={profiles}
              active={this.newState.activedItem}
              onChange={this.setState({activedItem: index})}
              
            />
            <DropDown style={{ height: "40PX", width: "200px" }}
              items={profiles}
            />*/

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
            <hr></hr>
            <Button mode="strong" onClick={() => {
              api.addMember('0x74404792c88a0FaDb9f00b2b852046dbaDDA3E44', toHex('aa'), 35, 45)
            }}>
              Add member
            </Button>
            <Button mode="strong" onClick={() => {
              api.assignProfileToMember('0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb', toHex('ss'))
            }}>
              Assign profile to membere
            </Button>
          </CardContent>
        </Card>


        <Card className="padded" width="100%" height="100%">
          <form onSubmit={e => e.preventDefault()}>
            <text>FinalPofile</text>
            <TextInput style={{ height: "40PX", width: "200px", marginLeft: "5px", marginRight: "5px" }} type="text" ref={input => (_finalPofile = input)}/>
            <text>InitialProfile</text>
            <TextInput style={{ height: "40PX", width: "200px", marginLeft: "5px", marginRight: "5px" }} type="text" ref={input => (_initialProfile = input)} />
            <text>Time(months)</text>
            <TextInput style={{ height: "40PX", width: "200px", marginLeft: "5px", marginRight: "5px" }} type="number" ref={input => (_timeCondition = input)} />
            <text>Contributions</text>
            <TextInput style={{ height: "40PX", width: "200px", marginLeft: "5px", marginRight: "5px" }} type="number" ref={input => (_contributionCondition = input)} />

              <Buttons>
                <Button style={{ height: "40PX", marginleft: "" }} mode="strong" onClick={() => {
                  //alert(toHex(_finalPofile));
                  api.addTransition(toHex(_finalPofile.value), toHex(_initialProfile.value), _timeCondition.value, _contributionCondition.value);
                }}>
                  Add Transition</Button>
                <Button style={{ height: "40PX", marginleft: "" }} type="button" mode="secondary" onClick={e => handleSubmit(false)}>
                  Cancel
              </Button>
              </Buttons>
          </form>
        </Card>
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
  TextInput {
        height: 60px;
    }
  
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
  
const Syncing = styled.div.attrs({children: "Syncing…" })`
        position: absolute;
        top: 15px;
        right: 20px;
      `;
      
      export default App;
