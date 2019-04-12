import React from "react";
import { Button, TextInput, SidePanel, Text,DropDown } from "@aragon/ui";
import styled from "styled-components";
import { toHex,soliditySha3 } from "web3-utils";

export const SideBar = ({
  activeAddProfile,
  setActiveAddProfile,
  opened,
  perfilActivo,
  handleAddProfile,
  setOpened,
  active,
  setActived,
  profiles,
  handleAddTransition,
  _contributionCondition,
  _timeCondition
}) => (
  <SidePanel
    title="New Profile"
    opened={opened}
    onClose={() => setOpened(false)}
  >
    {activeAddProfile ? (
      <SidePanelContent>
        <TextInput
          placeholder="Profile Name"
          ref={input => (perfilActivo = input)}
        />
        <Button
          style={{ height: "40PX", marginleft: "" }}
          mode="secondary"
          onClick={() => {
            handleAddProfile(perfilActivo.value);
            setOpened(false);
          }}
        >
          Add profile
        </Button>
      </SidePanelContent>
    ) : (
      <SidePanelContent>
        <Text>FinalPofile</Text>
        <DropDown items={profiles} active={active} onChange={setActived} />
        <Text>Time(months)</Text>
        <TextInput
          style={{
            height: "40PX",
            width: "200px",
            marginLeft: "5px",
            marginRight: "5px"
          }}
          type="number"
          ref={input => (_timeCondition = input)}
        />
        <Text>Contributions</Text>
        <TextInput
          style={{
            height: "40PX",
            width: "200px",
            marginLeft: "5px",
            marginRight: "5px"
          }}
          type="number"
          ref={input => (_contributionCondition = input)}
        />

        <Buttons>
          <Button
            style={{ height: "40PX", marginleft: "" }}
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
          >
            {profiles[active]}
          </Button>
        </Buttons>
      </SidePanelContent>
    )}
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
