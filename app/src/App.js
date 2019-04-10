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
  const [transitionsExist, setTransitionsExist] = useState(false)
  const [transitionsActivas,setTransitionsActivas] = useState(new Array())
  
const handleAddProfile = (profile) => {
  
  setPerfilActivo(profile)
  api.addProfile(toHex(profile))
}

const cambiarPerfil = (profile) => {
  
  setPerfilActivo(profile)
  let transitionsProfile = new Array()

  for(let key in transitions){

    for(let i = 0; i < profiles.length; i++){
     
      if(key == soliditySha3(profile,profiles[i]))
      {
       
        setTransitionsExist(true)
        transitionsProfile.push({finalProfile: profiles[i], hash: soliditySha3(profile,profiles[i])})
      }
    }
    
  }
  setTransitionsActivas(transitionsProfile)
  if(transitionsProfile.length == 0)
  setTransitionsExist(false)
}
  /*Esto hace que funcionen los dropdowns pero no consigo igualar el active que en teoria es el indice del array que esta seleccionado
    y con esto poner algo parecido a toHex(profiles[active].value) dentro de addTransition como finalProfile e igual con profiles[active2].value 
    para el initialProfile  
    */
   
   /*
      const [active2, setActived2] = useState(0);
      
        <DropDown
        items={profiles}
        active={active2}
        onChange={setActived2}
      />*/
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


        <Card className="padded" width="100%" height="100%">
         
        <Text>FinalPofile</Text>
            <DropDown
        items={profiles}
        active={active}
        onChange={setActived}
      />
            <Text>Time(months)</Text>
            <TextInput style={{ height: "40PX", width: "200px", marginLeft: "5px", marginRight: "5px" }} type="number" ref={input => (_timeCondition = input)} />
            <Text>Contributions</Text>
            <TextInput style={{ height: "40PX", width: "200px", marginLeft: "5px", marginRight: "5px" }} type="number" ref={input => (_contributionCondition = input)} />
            
            <Buttons>
              <Button style={{ height: "40PX", marginleft: "" }} mode="strong" onClick={(_aa) => {
                _aa = soliditySha3(perfilActivo,profiles[active]);
                
                api.addTransition(_aa, toHex(perfilActivo),toHex(profiles[active]),1, 1);
              }}>{profiles[active]}</Button>
              </Buttons>
          <Transitions
          perfilActivo = {perfilActivo}
          transitions = {transitions}
          transitionsActivas = {transitionsActivas}
          transitionsExist = {transitionsExist}
          />


        </Card>
      </BaseLayout>
      <SideBar
        opened ={opened}
        perfilActivo ={perfilActivo}
        handleAddProfile={handleAddProfile}
        setOpened={setOpened}
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
