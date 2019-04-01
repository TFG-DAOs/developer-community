pragma solidity >=0.4.22 <0.6.0;

import "@aragon/os/contracts/apps/AragonApp.sol";

contract ProfileManager is AragonApp {

    bytes32[] arrayProfiles;

    //Profile events.
    event AddProfile(address indexed entity, bytes32 profile);
    event RemoveProfile(address indexed entity, bytes32 profile);

    //event RemoveProfile(address indexed entity, bytes32 profile);


    mapping(bytes32 => bool) profiles;

    struct Member {
        bytes32 profile;
        uint256 creationDate;
        bool exists;
    }
    struct Conditions {
        /*The transition from initial to final profile exists.*/
        bool initToFinalProfileExists;
        uint256 requestedTime; // in days
        uint256 requestedContributions;

    }
    struct TransitionDetails {
        mapping(bytes32 =>bool) initialProfiles;
        //conditions
    }

    mapping(address => Member) members;

    /*key: destinyProfile | value: (key : initialProfile | value: Necessary conditions to pass from one profile to another)*/
    mapping(bytes32 => mapping(bytes32 => Conditions)) transitionRegister;

    function initialize() onlyInit public {
        initialized();
    }

     /**
      * @notice Add "`@fromHex(newProfile)`" as a new profile
      * @param newProfile Name of the profile to be added
      */
    function addProfile(bytes32 newProfile) public {
        require(!profiles[newProfile], "This profile is already added");
        profiles[newProfile] = true;
        emit AddProfile(msg.sender, newProfile);
    }

    function removeProfile(bytes32 profileToRemove) public {
        require(profiles[profileToRemove]);
        profiles[profileToRemove] = false;
        bool found = false;
        uint256 i = 0;
        while(!found && arrayProfiles.length > i){
            if(arrayProfiles[i] == profileToRemove){
                found = true;
                delete arrayProfiles[i];
                arrayProfiles[i] = arrayProfiles[arrayProfiles.length-1];
            }
            i++;
        }
        emit RemoveProfile(msg.sender, profileToRemove);
    }

    function assignProfileToMember(address member, bytes32 profile) public {
        require(members[member].exists);
        //check if new profile can be assign to member given his current profile.
        bytes32 memberProfile = members[member].profile;
        require(transitionRegister[profile][memberProfile].initToFinalProfileExists);
        //check profile restrictions (time, contributions, etc).
        members[member].profile = profile;
    }

    function addTransition(bytes32 initialProfile, bytes32 finalProfile, uint256 timeCondition, uint256 contributionCondition) public {
        /*Both initial and final profile should exists.*/
        require(profiles[initialProfile]);
        require(profiles[finalProfile]);

        transitionRegister[finalProfile][initialProfile].initToFinalProfileExists = true;
        transitionRegister[finalProfile][initialProfile].requestedTime = timeCondition;
        transitionRegister[finalProfile][initialProfile].requestedContributions = contributionCondition;

    }

    function removeTransition(bytes32 initialProfile, bytes32 finalProfile) public {
        require(transitionRegister[finalProfile][initialProfile].initToFinalProfileExists);
        transitionRegister[finalProfile][initialProfile].initToFinalProfileExists = false;

    }
    function changeConditions(bytes32 initialProfile, bytes32 finalProfile, uint256 timeCondition, uint256 contributionCondition) public {
        require(transitionRegister[finalProfile][initialProfile].initToFinalProfileExists);
        transitionRegister[finalProfile][initialProfile].requestedTime = timeCondition;
        transitionRegister[finalProfile][initialProfile].requestedContributions = contributionCondition;
    }
}
