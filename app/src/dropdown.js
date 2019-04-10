/*<Button mode="strong" onClick={() => setOpened(true)}>
New profile
</Button>
<hr></hr>

<Button mode="strong" onClick={() => {
api.addMember('0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb', toHex('aa'), 35, 45)

}}>
AddMember1
</Button>
<Button mode="strong" onClick={() => {
api.addMember('0xb4124cEB3451635DAcedd11767f004d8a28c6eE7', toHex('aa'), 35, 45)


}}>
AddMember2
</Button>
<Button mode="strong" onClick={() => {
api.assignProfileToMember('0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb', toHex('ss'))
}}>
Assign profile to 
</Button>
<Button mode="strong" onClick={() => {
api.assignProfileToMember('0xb4124cEB3451635DAcedd11767f004d8a28c6eE7', toHex('ss'))
}}>
Assign profile to member2
</Button>






<form onSubmit={e => e.preventDefault()}>
            <text>FinalPofile</text>
            <DropDown
        items={profiles}
        active={active}
        onChange={setActived}
      />
            <text>InitialProfile</text>
            <TextInput style={{ height: "40PX", width: "200px", marginLeft: "5px", marginRight: "5px" }} type="text" ref={input => (_initialProfile = input)} />
            <text>Time(months)</text>
            <TextInput style={{ height: "40PX", width: "200px", marginLeft: "5px", marginRight: "5px" }} type="number" ref={input => (_timeCondition = input)} />
            <text>Contributions</text>
            <TextInput style={{ height: "40PX", width: "200px", marginLeft: "5px", marginRight: "5px" }} type="number" ref={input => (_contributionCondition = input)} />

            <Buttons>
              <Button style={{ height: "40PX", marginleft: "" }} mode="strong" onClick={() => {
                //alert(toHex(_finalPofile));

                api.addTransition(toHex(profiles[active]), toHex(_initialProfile.value), _timeCondition.value, _contributionCondition.value);
              }}>{profiles[active]}</Button>
              <Button style={{ height: "40PX", marginleft: "" }} mode="strong" onClick={() => {
                //alert(toHex(_finalPofile));
                api.changeConditions(toHex(_finalProfile.value), toHex(_initialProfile.value), _timeCondition.value, _contributionCondition.value);
              }}>Change Conditions</Button>
               <Button mode="strong" onClick={() =>{
                  api.removeTransition(toHex(_initialProfile.value),toHex(_finalProfile.value));
              }}>
              Remove Transition
              </Button>
            </Buttons>

<TextInput placeholder="Profile Name" ref = { input => setPerfil(input)} />s


 {profiles.map(profile => (
                <li key={profile} onClick={() => setPerfilActivo(profile)}>
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



              trasnstion[aa-ss]{condiotiops}
*/