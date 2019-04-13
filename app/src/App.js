import React from "react";
import { useState } from "react";

import { useAragonApi } from "@aragon/api-react";
import {
  Main,
  Button,
  TextInput,
  TabBar,
  Card,
  Text,
  SidePanel,
  IconCross,
  DropDown,
  IdentityBadge
} from "@aragon/ui";
import {SideBar} from "./SideBar";
import {Transitions} from "./Transitions";
import {Members} from "./Members";
import styled from "styled-components";
import { toHex, soliditySha3 } from "web3-utils";

function App() {
  /*
  api contiene todos los metodos del contrato
  appState es el estado que devuelve la ultima funcion redux que se ha ejecutado.
  */
  let  _finalProfile, _initialProfile, _timeCondition, _contributionCondition, _newTimeCondition, _newContributionCondition;
  const { api, appState } = useAragonApi();
  const {profiles,transitions,members, syncing } = appState;
  const [opened, setOpened] = useState(false);
  const [active, setActived] = useState(0);
  const [perfilActivo,setPerfilActivo] = useState('')
  const [activeAddProfile, setActiveAddProfile] = useState(0)
  const [mode, setMode] = useState('Transition')
  
const handleAddProfile = (profile) => {
  
  setPerfilActivo(profile)
  api.addProfile(toHex(profile))
}
const handleRemoveTransition = (initial,final) =>{
  api.removeTransition(initial,final);
  
}
const handleChangeConditions = (initialProfile, finalProfile, timeCondition, contributionCondition) => {
  api.changeConditions(initialProfile,  finalProfile, timeCondition,  contributionCondition)
}
const handleAddTransition = (initial,final,time,contribution) =>{
  api.addTransition(initial,final,time,contribution)
}

const cambiarPerfil = (profile) => {
  setPerfilActivo(profile)
}
  return (
    <Main>
      <BaseLayout>
        {syncing && <Syncing />}

        <Card style={{ height: "100%", width: "300px" }}>
          <CardContent>
            <ul>
              {profiles.map(profile => (
                <li>
                   <Button
                  mode ="text"
                  onClick={() => cambiarPerfil(profile)}>
                  {profile}
                  </Button>
                  <Button onClick={() => {
                    api.removeProfile(toHex(profile));
                    }}><IconCross />
                  </Button>
                  </li> 
              ))}
            </ul>
            <Button mode="strong" onClick={() => {setActiveAddProfile(true)
              setOpened(true)}}>New profile
            </Button>
            <Button mode="strong" onClick={() => {
              console.log("POR AQUIII");
              api.addMember("0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb",toHex("SP"),3);
            }}>Add a Member</Button>
          </CardContent>
        </Card>

        <Card className="padded" width="100%" height="100%">
          <Transitions
          perfilActivo = {perfilActivo}
          transitions = {transitions}
          handleRemoveTransition={handleRemoveTransition}
          setActiveAddProfile = {setActiveAddProfile}
          setOpened={setOpened}
          setMode={setMode}
          />
        </Card>

        <Members 
        members = {members}
        activeProfile = {perfilActivo}
        />


      </BaseLayout>
      <SideBar
        activeAddProfile={activeAddProfile}
        setActiveAddProfile={setActiveAddProfile}
        opened={opened}
        perfilActivo={perfilActivo}
        handleAddProfile={handleAddProfile}
        setOpened={setOpened}
        active={active}
        setActived={setActived}
        profiles={profiles}
        handleAddTransition={handleAddTransition}
        handleChangeConditions={handleChangeConditions}
        mode={mode}
        
        />

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


const CardContent = styled.div`
    margin-top: 200px;
    text-align: center;
  `;


const Syncing = styled.div.attrs({ children: "Syncing…" })`
        position: absolute;
        top: 15px;
        right: 20px;
      `;

export default App;
