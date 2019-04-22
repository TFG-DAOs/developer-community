import React from "react";
import {
    IdentityBadge,
    AppView,
    Button,
    Table,
    Text,
    TableRow,
    TableCell,
    IconPlus,
    Toast,
    ToastHub
} from "@aragon/ui";
import { toHex } from "web3-utils";
import styled from "styled-components";

export const Members = ({
    members,
    activeProfile,
    setMember,
    setGoUp,
    handleIncrementContributionsMember,
    transitions
  }) => (
    <AppView style={{display:"flex", justifyContent:"center", height: "auto"}}title = "MEMBERS">
    <Table
      header={
        <TableRow>
              <TableCell>
                <Text>ADDRESS</Text>
              </TableCell>
              <TableCell>
                <Text>CREATION TIME</Text>
              </TableCell>
              <TableCell>
                <Text>CONTRIBUTIONS</Text>
              </TableCell>
              <TableCell>
                <Text>ASSIGN</Text>
              </TableCell>
            </TableRow>
      }
    >
      {Object.keys(members).filter(m => (members[m].profile == activeProfile)).map(member => (
        <TableRow>
          <TableCell>
            <IdentityBadge entity={member} customLabel="true"/>
          </TableCell>
          <TableCell>
            <Text>{Math.trunc((((Date.now()/1000) - members[member].creationDate)/(3600*24)))}</Text>
          </TableCell>
          <TableCell>
            <Text>{members[member].contributions}</Text>
            <Button mode="outline" style={{padding: "4px"}}onClick={()=>{
              handleIncrementContributionsMember(member);
            }}
            ><IconPlus/>
            </Button>
          </TableCell>
          <TableCell>
            {checkTransit(transitions,activeProfile,members,member)}
            {(found)? (
              <Button mode = "outline"                
              style={{ alignContent: "center"}} 
              onClick={() => {
                          setGoUp(true);
                          setMember(member); 
                        }}
              >Assign</Button>
            ):(<ToastHub>
                  <Toast>
                    {toast => (
                      <Button onClick={() => toast("El miembro " + member + " puede transitar a ningún perfil")}>Assign</Button>
                    )}
                  </Toast>
                </ToastHub>)}
            
          </TableCell>
        </TableRow>
      ))}
    </Table>
    </AppView>
  );

  let found = false
  function checkTransit(transitions,activeProfile,members,member) {
    if(member != undefined){
      if(transitions[activeProfile] != undefined){
      //Search for a transition profile
        for(let key in transitions[activeProfile]){
          if( transitions[activeProfile][key].timeCondition <= (((Date.now()/1000) - members[member].creationDate)/(3600*24))
            && transitions[activeProfile][key].contributionCondition  <= members[member].contributions ){
              found = true;
          }
          else{
            found = false;
          }
        } 
      }
      else{
        found = false
      }
    }
                              
  }
  const Buttons = styled.div`
  align-items: center;
    align-content: center;
    justify-content: center;
    display: flex;
    margin-top: 2%;
`;