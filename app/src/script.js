import '@babel/polyfill'
import { of } from 'rxjs'
import AragonApi from '@aragon/api'
import { toUtf8 } from 'web3-utils'
const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')

const api = new AragonApi()

const reducer = (state, event) => {
  let newState
  console.log(state, event)
  switch (event.event) {
    case INITIALIZATION_TRIGGER:
      newState = {
        profiles: [],
        transitions: {},
        members: {}
      }
      break
    case 'AddProfile':
      console.log(toUtf8(event.returnValues.profile))
      newState = {
        ...state,
        profiles: [...state.profiles, toUtf8(event.returnValues.profile)]
      }
      break
    case 'RemoveProfile':
      newState = { count: count - parseInt(event.returnValues.step) }
      break
    default:
      newState = state
  }
  console.log(newState)
  return newState
}

api.store((state, event) => {
  try {
    return reducer(state, event)
  } catch(e) {
    console.error(e)
    throw e
  }
},
  [
    // Always initialize the store with our own home-made event
    of({ event: INITIALIZATION_TRIGGER }),
  ]
)

funct
