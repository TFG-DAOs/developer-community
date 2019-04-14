import React from "react";
import { Button, TextInput, SidePanel, Text, DropDown } from "@aragon/ui";
import styled from "styled-components";
import { toHex, soliditySha3 } from "web3-utils";

export const SideBar = ({
  activeAddProfile,
  activeAddMember,
  setActiveAddProfile,
  opened,
  perfilActivo,
  handleAddProfile,
  handleAddMember,
  setOpened,
  active,
  setActived,
  profiles,
  handleAddTransition,
  handleChangeConditions,
  mode,
  _contributionCondition,
  _timeCondition,
  memberToAdd
}) => (
    <SidePanel
      title="New Profile"
      opened={opened}
      onClose={() => setOpened(false)}
    >
      {activeAddProfile ? (
        <SidePanelContent>
          {!activeAddMember ? (
            <React.Fragment>
              <TextInput
                placeholder="Profile Name"
                ref={input => (perfilActivo = input)}
              />
              <Button
                mode="secondary"
                onClick={() => {
                  handleAddProfile(perfilActivo.value);
                  setOpened(false);
                }}
              > Add profile</Button>
            </React.Fragment>
              ):(<React.Fragment>
                  <TextInput
                    placeholder="Member Address"
                    ref={inputMember => (memberToAdd = inputMember)}
                  />
                  <Button
                    mode="secondary"
                    onClick={() => {
                      handleAddMember(memberToAdd.value);
                      setOpened(false);
                    }}
                > Add Member</Button>
               </React.Fragment>
              )}
        </SidePanelContent>
        
      ) : (

          <SidePanelContent>
            <Text>FinalPofile</Text>
            <DropDown items={profiles} active={active} onChange={setActived} />
            
              <Text>Time(months)</Text>
              <TextInput
                type="number"
                ref={input => (_timeCondition = input)}
              />
            <Text>Contributions</Text>
            <TextInput
              type="number"
              ref={input => (_contributionCondition = input)}
            />
            {mode == 'Transitions' ? (
              <Buttons>
                <Button
                  mode="strong"
                  onClick={() => {
                    handleAddTransition(
                      toHex(perfilActivo),
                      toHex(profiles[active]),
                      _timeCondition.value,
                      _contributionCondition.value
                    );
                    setOpened(false);
                  }}
                >Add</Button>
              </Buttons>


            ) : (<Buttons>
              <Button
                mode="strong"
                onClick={() => {
                  handleChangeConditions(
                    toHex(perfilActivo),
                    toHex(profiles[active]),
                    _timeCondition.value,
                    _contributionCondition.value
                  );
                  setOpened(false);
                }}
              >Edit</Button>
            </Buttons>)}

          </SidePanelContent>
        )}
    </SidePanel>
  );

const SidePanelContent = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
`;
const Trans = styled.div` 
  display: flex;
`

const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  margin-top: 20px;
`;