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
        members: {},
        //membersMap: new Map()
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
      const timeCondition = event.returnValues.timeCondition;
      const contributionCondition = event.returnValues.contributionCondition;
      const initToFinalProfileExists = true;
      const conditions = { initToFinalProfileExists, timeCondition, contributionCondition }
      console.log(finalProfile);
      console.log(initialProfile);
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
    case 'AddMember':
      const _member = event.returnValues.member;
      const _profile = toUtf8(event.returnValues.profile);
      const _exist = true;
      const _creationDate = event.returnValues.creationDate;
      const _contributions = event.returnValues.contributions;
      console.log(_member);
      console.log(_profile);
      console.log(_creationDate);
      console.log(_contributions);

      newState = {
        ...state,
        members: {
          ...state.members,
          [_member]: {
            profile: _profile,
            creationDate: _creationDate,
            exist: _exist,
            contributions: _contributions,
          }
        }
      }
      break
    case 'AssignProfileToMember':

      const _profile_ = toUtf8(event.returnValues.profile);
      const _member_ = event.returnValues.member;

      console.log("Estoy en: AssignProfileToMember")
      //console.log(members[0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb].profile);
      newState = {
        ...state,
        members: {
          ...state.members,
          [_member_]: {
            ...state.members[_member_],
            profile: _profile_,
          }
        }
      }
      //newState.membersMap.set(event.returnValues.member, event.returnType.profile)
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


