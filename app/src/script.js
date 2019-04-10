import "@babel/polyfill";
import { of } from "rxjs";
import AragonApi from "@aragon/api";
import { toUtf8 } from "web3-utils";
const INITIALIZATION_TRIGGER = Symbol("INITIALIZATION_TRIGGER");

const api = new AragonApi();

const reducer = (state, event) => {
  let newState;
  console.log(state, event);
  switch (event.event) {
    case INITIALIZATION_TRIGGER:
      newState = {
        profiles: [],
        transitions: {},
        members: {}
      };
      break;
    case "AddProfile":
      newState = {
        ...state,
        profiles: [...state.profiles, toUtf8(event.returnValues.profile)]
      };
      break;
    case "RemoveProfile":
      const remove = (state, keyProfile) => {
        const pos = state.findIndex(function(element) {
          return element == keyProfile;
        });
        state.splice(pos, 1);
        /*const result = state.filter(profile => {
          console.log(profile, "========",keyProfile)
          return profile != keyProfile
        })*/
        return state;
      };
      newState = {
        ...state,
        profiles: remove(state.profiles, toUtf8(event.returnValues.profile))
      };
      break;
    case "AddTransition":
      {
        const finalProfile = event.returnValues.test;
        console.log(finalProfile);
        const _timeCondition = event.returnValues.timeCondition;
        const _contributionCondition = event.returnValues.contributionCondition;
        const _initToFinalProfileExists = true;
       
        newState = {
          ...state,
          transitions: {
            ...state.transitions,
            [finalProfile]: {
              initToFinalProfileExists: _initToFinalProfileExists,
              timeCondition: _timeCondition,
              contributionCondition: _contributionCondition
            }
             
          }
        };
      }
      break;
    case "AddMember":
      const _member = event.returnValues.member;
      const _profile = toUtf8(event.returnValues.profile);
      const _exist = true;
      const _creationDate = event.returnValues.creationDate;
      const _contributions = event.returnValues.contributions;
      newState = {
        ...state,
        members: {
          ...state.members,
          [_member]: {
            profile: _profile,
            creationDate: _creationDate,
            exist: _exist,
            contributions: _contributions
          }
        }
      };
      break;
    case "RemoveTransition":
      const test =event.returnValues.test;
      delete state.transitions[test]; 
        newState = {
        ...state,
        transitions: state.transitions
      };
      break;

    case "AssignProfileToMember":{
      const profile = toUtf8(event.returnValues.profile);
      const member = event.returnValues.member;
      newState = {
        ...state,
        members: {
          ...state.members,
          [member]: {
            ...state.members[member],
            profile: profile
          }
        }
      };
    }
      break;
    case "ChangeConditions":
      {
        const test = event.returnValues.test;
        const _initToFinalProfileExists = true;
        const _timeCondition = event.returnValues.timeCondition;
        const _contributionCondition = event.returnValues.contributionCondition;

        newState = {
          ...state,
          transitions: {
            ...state.transitions,
            [test]: {
              initToFinalProfileExists: _initToFinalProfileExists,
              timeCondition: _timeCondition,
              contributionCondition: _contributionCondition
            }
          }
        };
      }
      break;
    default:
      newState = state;
  }
  console.log(newState);
  return newState;
};

api.store(
  (state, event) => {
    try {
      return reducer(state, event);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  [of({ event: INITIALIZATION_TRIGGER })]
);
