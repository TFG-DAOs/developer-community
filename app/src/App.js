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
  DropDown
} from "@aragon/ui";
import {SideBar} from "./SideBar";
import {Transitions} from "./Transitions";
import styled from "styled-components";
import { toHex, soliditySha3 } from "web3-utils";

function App() {
  /*
  api contiene todos los metodos del contrato
  appState es el estado que devuelve la ultima funcion redux que se ha ejecutado.
  */
  let  _finalProfile, _initialProfile, _timeCondition, _contributionCondition, _newTimeCondition, _newContributionCondition;
  const { api, appState } = useAragonApi();
  const { /*timeCondition, contributionCondition ,*/ profiles,transitions, syncing } = appState;
  const [opened, setOpened] = useState(false);
  const [active, setActived] = useState(0);
  const [perfilActivo,setPerfilActivo] = useState('')
  const [activeAddProfile, setActiveAddProfile] = useState(0)
  
const handleAddProfile = (profile) => {
  
  setPerfilActivo(profile)
  api.addProfile(toHex(profile))
}
const handleRemoveTransition = (initial,final) =>{
  api.removeTransition(initial,final);
  
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
          </CardContent>
        </Card>

        <Card className="padded" width="100%" height="100%">
          <Transitions
          perfilActivo = {perfilActivo}
          transitions = {transitions}
          handleRemoveTransition={handleRemoveTransition}
          setActiveAddProfile = {setActiveAddProfile}
          setOpened={setOpened}
          />
        
        </Card>
      </BaseLayout>
      <SideBar
        activeAddProfile = {activeAddProfile}
        setActiveAddProfile = {setActiveAddProfile}
        opened ={opened}
        perfilActivo ={perfilActivo}
        handleAddProfile={handleAddProfile}
        setOpened={setOpened}
        active={active}
        setActived={setActived}
        profiles={profiles}
        handleAddTransition = {handleAddTransition}
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
