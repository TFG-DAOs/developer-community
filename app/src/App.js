import React from 'react'
import { useAragonApi } from '@aragon/api-react'
import { Main, Button, TextInput } from '@aragon/ui'
import styled from 'styled-components'
import { toHex } from 'web3-utils'
function App() {
  /*
  api contiene todos los metodos del contrato
  appState es el estado que devuelve la ultima funcion redux que se ha ejecutado.
  */
  let _profile
  const { api, appState } = useAragonApi()
  const { profiles, syncing } = appState
  return (
    <Main>
      <BaseLayout>
        {syncing && <Syncing />}
        <ul>
          {profiles.map(profile => (
            <li key={profile}>{profile}</li>
          ))}
        </ul>
        <Buttons>
          {/* Hay que ponerlo entre comillas incluso si es una variable numerica. */}
          <Button
            mode="secondary"
            onClick={() => {
              api.addProfile(toHex(_profile.value))
            }}
          >
            Add profile
          </Button>
          <TextInput ref={input => (_profile = input)} />

          <Button
           mode="secondary" 
           onClick={() => {
           api.removeProfile(toHex(_profile.value))
          }}
          >
            Remove Profile
          </Button>
        </Buttons>
      </BaseLayout>
    </Main>
  )
}

const BaseLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
`

const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  margin-top: 20px;
`

const Syncing = styled.div.attrs({ children: 'Syncing…' })`
  position: absolute;
  top: 15px;
  right: 20px;
`

export default App
