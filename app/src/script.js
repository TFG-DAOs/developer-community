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

      const remove = (state, keyProfile) => {
        const pos = state.findIndex(function (element) {
          return element == keyProfile
        })
        state.splice(pos, 1)
        /*const result = state.filter(profile => {
          console.log(profile, "========",keyProfile)
         
           
          return profile != keyProfile
        })*/
        console.log("RESULTADOOOOOOOO", state)

        return state
      }
      newState = {
        ...state,
        profiles: remove(state.profiles, toUtf8(event.returnValues.profile)),
      }
      break
    case 'AddTransition':
     
      const finalProfile = toUtf8(event.returnValues.finalProfile);
      const initialProfile = toUtf8(event.returnValues.initialProfile);
      const timeCondition =  event.returnValues.timeCondition;
      const contributionCondition =  event.returnValues.contributionCondition;
      const open = true;
      const conditions = { open, timeCondition, contributionCondition}
      console.log(initialProfile)
      console.log(finalProfile)
      console.log(timeCondition)
      console.log(contributionCondition)
      console.log(conditions)
      newState = {
        ...state,
        transitions: {
          ...state.transitions,
          [finalProfile]: {
            ...state.transitions[finalProfile],
            [initialProfile]: conditions,
          },
        },
    }
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
  } catch (e) {
    console.error(e)
    throw e
  }
},
  [
    // Always initialize the store with our own home-made event
    of({ event: INITIALIZATION_TRIGGER }),
  ]
)


