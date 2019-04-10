pragma solidity >=0.4.22 <0.6.0;

import "@aragon/os/contracts/apps/AragonApp.sol";

contract ProfileManager is AragonApp {

    bytes32[] arrayProfiles;

    //Profile events.
    event AddProfile(address indexed entity, bytes32 profile);
    event RemoveProfile(address indexed entity, bytes32 profile);
    event AddTransition(address indexed entity, bytes32 test, uint256 timeCondition, uint256 contributionCondition);
    event ChangeConditions(address indexed entity, bytes32 test, uint256 timeCondition, uint256 contributionCondition);
    event AssignProfileToMember(address indexed entity, address member, bytes32 profile);
    event RemoveTransition(address indexed entity, bytes32 test);
    event AddMember(address indexed entity, address member, bytes32 profile, uint256 creationDate, uint256 contributions);
    
    //event RemoveProfile(address indexed entity, bytes32 profile);


    mapping(bytes32 => bool) profiles;

    struct Member {
        bytes32 profile;
        uint256 creationDate;
        bool exists;
        //just for testing purposes
        uint256 contributions;
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
    mapping(bytes32 => Conditions) transitionRegister;

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

     function addMember(address member, bytes32 profile, uint256 creationDate, uint256 contributions) public {
        members[member].profile = profile;
        members[member].creationDate = creationDate;
        members[member].contributions = contributions;
        members[member].exists = true;

        emit AddMember(msg.sender, member, profile, creationDate, contributions);

    }

    function assignProfileToMember(address member, bytes32 profile) public {
        require(members[member].exists);
          //check if new profile can be assign to member given his current profile.
        bytes32 memberProfile = members[member].profile;
        require(transitionRegister[profile].initToFinalProfileExists);
        members[member].profile = profile;
        emit AssignProfileToMember(msg.sender, member, profile);  
        //check profile restrictions (time, contributions, etc).
       // Conditions c = transitionRegister[profile][members[member].profile];
        //require(c.initToFinalProfileExists);
       // require(c.requestedTime <= members[member].creationDate);
        //require(c.requestedContributions <= members[member].contributions);
    }

    function addTransition(bytes32 test, bytes32 initialProfile, bytes32 finalProfile, uint256 timeCondition, uint256 contributionCondition) public {
        /*Both initial and final profile should exists.*/
        require(profiles[finalProfile]);
        require(profiles[initialProfile]);

        //test =  sha3(initialProfile, finalProfile);
        
        transitionRegister[test].initToFinalProfileExists = true;
        transitionRegister[test].requestedTime = timeCondition;
        transitionRegister[test].requestedContributions = contributionCondition;
        emit AddTransition(msg.sender, test, timeCondition, contributionCondition);
    }

    function removeTransition(bytes32 test) public {
        require(transitionRegister[test].initToFinalProfileExists);
        transitionRegister[test].initToFinalProfileExists = false;
        emit RemoveTransition(msg.sender, test);
    }
    function changeConditions(bytes32 test,  uint256 timeCondition, uint256 contributionCondition) public {
        require(transitionRegister[test].initToFinalProfileExists);
        transitionRegister[test].requestedTime = timeCondition;
        transitionRegister[test].requestedContributions = contributionCondition;
        emit ChangeConditions(msg.sender, test, timeCondition, contributionCondition);
    
    }
}
