import React from "react";
import { Button, TextInput, SidePanel, Text, DropDown, IdentityBadge } from "@aragon/ui";
import styled from "styled-components";
import { toHex, soliditySha3 } from "web3-utils";

export const ChangeProfile = ({
    member,
    profiles,
    active,
    setActived,
    goUp,
    setGoUp,
    handleAsignProfileToMember,
}) => (
        <SidePanel
            title="Assign a Profile to a Member"
            opened={goUp}
            onClose={() => setGoUp(false)}
        >
            <SidePanelContent>
                <Content>
                <IdentityBadge entity= {member} customLabel="true" />
                
                <DropDown items={profiles} active={active} onChange={setActived} />
                <Buttons>
                    <Button
                        mode="strong"
                        onClick={() => {
                            handleAsignProfileToMember(member,toHex(profiles[active]));
                            setGoUp(false);
                        }}
                    >Assign</Button>
                </Buttons>
                </Content>
            </SidePanelContent>
            
    </SidePanel>
    );

const SidePanelContent = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
`;


const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  margin-top: 20px;
`;
const Content = styled.div`
    margin-top: 100px;
    text-align: center;
  `;