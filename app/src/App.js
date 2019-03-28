import React from 'react'
import { useAragonApi } from '@aragon/api-react'
import { Main, Button } from '@aragon/ui'
import styled from 'styled-components'

function App() {
  /*
  api contiene todos los metodos del contrato
  appState es el estado que devuelve la ultima funcion redux que se ha ejecutado.
  */
  const { api, appState } = useAragonApi()
  const { count, syncing } = appState
  return (
    <Main>
      <BaseLayout>
        {syncing && <Syncing />}
        <Count>Count: {count}</Count>
        <Buttons>
          {/* Hay que ponerlo entre comillas incluso si es una variable numerica. */}
          <Button mode="secondary" onClick={() => api.addProfile("0x50657266696c31")}>
            Decrement
          </Button>
          <Button mode="secondary" onClick={() => api.increment(1)}>
            Increment
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

const Count = styled.h1`
  font-size: 30px;
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
