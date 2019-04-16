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
import {ChangeProfile} from "./ChangeProfile";
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
  const [activeAddMember, setActiveAddMember] = useState(0)
  const [mode, setMode] = useState('Transition')
  const [goUp, setGoUp] = useState(false);
  const [_member, setMember] = useState('');
  
  const handleAscend = (member) => {
    
  }
  const handleAsignProfileToMember = (member,profile) => {
    api.assignProfileToMember(member,toHex(profile))
  }
const handleAddProfile = (profile) => {
  
  setPerfilActivo(profile)
  api.addProfile(toHex(profile))
}
const handleAddMember = (member) => {
  console.log(member);
  api.addMember(String(member));
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
        <Card style={styleCardLeft}>
          <CardContent>
            <ul style={{textAlign:"left"}}>
              {profiles.map(profile => (
                <li>
                   <Button
                  mode ="text"
                  onClick={() => cambiarPerfil(profile)}>
                  {profile}
                  </Button>
                  <Button style={{float: "right"}} onClick={() => {
                    api.removeProfile(toHex(profile));
                    }}><IconCross/>
                  </Button>
                  </li> 
              ))}
            </ul>
            <ContainerButtons>
              <Button mode="strong" style = {{width: "100%"}}onClick={() => {
                setActiveAddProfile(true)
                setOpened(true)
                setActiveAddMember(false);
                }}>New profile
                
              </Button>
            </ContainerButtons>
          </CardContent>
        </Card>
        
        <Card className="padded" width="80%" height="auto">
          <Transitions
          perfilActivo = {perfilActivo}
          transitions = {transitions}
          handleRemoveTransition={handleRemoveTransition}
          setActiveAddProfile = {setActiveAddProfile}
          setOpened={setOpened}
          setMode={setMode}
          />
        </Card>
        <Card style={styleCardLeft}>
          <CardContent>
            <Button mode="strong" style={{width: "100%"}} onClick={() => {
                  console.log("POR AQUIII");
                  setActiveAddProfile(true)
                  setActiveAddMember(true)
                  setOpened(true)            
              }} >Add Member</Button>
          </CardContent>
          </Card>
          <Card style={{width:"80%", height:"auto"}}>
            <Members 
                members = {members}
                activeProfile = {perfilActivo}
                handleAscend = {handleAscend}
                setGoUp = {setGoUp}
                setMember = {setMember}

              />
        </Card>
        
      </BaseLayout>
      <ChangeProfile
        handleAsignProfileToMember ={handleAsignProfileToMember}
        active={active}
        setActived={setActived}
        goUp = {goUp}
        setGoUp = {setGoUp}
        member = {_member}
        profiles = {profiles}    
      />
      <SideBar
        activeAddProfile={activeAddProfile}
        activeAddMember = {activeAddMember}
        setActiveAddProfile={setActiveAddProfile}
        opened={opened}
        perfilActivo={perfilActivo}
        handleAddProfile={handleAddProfile}
        handleAddMember={handleAddMember}
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

const styleCardLeft = {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      width: "20%",
      height:"auto"
}
const BaseLayout = styled.div`
      display: flex;
      height: auto;
      flex-direction: row;
      flex-wrap: wrap;
      TextInput {
            height: 60px;
        }
  
  `;


const CardContent = styled.div`
    text-align: center;
  `;

const ContainerButtons = styled.div`
    display: flex;
    flex-wrap: wrap;
    width:100%;
    justify-content:center;
    align-items:center;
`;
const Syncing = styled.div.attrs({ children: "Syncing…" })`
        position: absolute;
        top: 15px;
        right: 20px;
      `;

export default App;
