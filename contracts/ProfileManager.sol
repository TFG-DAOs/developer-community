pragma solidity >=0.4.22 <0.6.0;

import "@aragon/os/contracts/apps/AragonApp.sol";

contract ProfileManager is AragonApp {

    bytes32[] arrayProfiles;

    //Profile events.
    event AddProfile(address indexed entity, bytes32 profile);
    event RemoveProfile(address indexed entity, bytes32 profile);
    event AddTransition(address indexed entity, bytes32 initialProfile, bytes32 finalProfile, uint256 timeCondition, uint256 contributionCondition);
    event ChangeConditions(address indexed entity, bytes32 initialProfile, bytes32 finalProfile, uint256 timeCondition, uint256 contributionCondition);
    event RemoveTransition(address indexed entity, bytes32 initialProfile, bytes32 finalProfile);
    event AssignProfileToMember(address indexed entity, address member, bytes32 profile);
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
        arrayProfiles.push(newProfile);
        profiles[newProfile] = true;
        emit AddProfile(msg.sender, newProfile);
    }
       /**
      * @notice before remove  "`@fromHex(profileToRemove)`", remove transactions contains this profile
      * @param profileToRemove Name of the profile to be added
      */

    function removeProfile(bytes32 profileToRemove) public {
       require(profiles[profileToRemove]);
     
       uint j = 0;
        while(arrayProfiles.length > j){
            bytes32 _hash1 = keccak256(arrayProfiles[j],profileToRemove);//todos los perfiles a profileToRemove
            bytes32 _hash2 = keccak256(profileToRemove,arrayProfiles[j]);
            require(!transitionRegister[_hash1].initToFinalProfileExists);
            require(!transitionRegister[_hash2].initToFinalProfileExists); 
            j++;
        }

        bool found = false;
        uint256 i = 0;
        while((arrayProfiles.length > i) && !found) {
            
            if(arrayProfiles[i] == profileToRemove){
                        profiles[profileToRemove] = false;
                        found = true;
                        arrayProfiles[i] = arrayProfiles[arrayProfiles.length-1];//copiamos el ultimo en i
                        delete arrayProfiles[arrayProfiles.length-1]; // eliminamos el ultimo
                    }
            i++;
        
        
        }
       emit RemoveProfile(msg.sender, profileToRemove);
    }

     function addMember(address member) public {
        require(!members[member].exists);
        require(profiles["AN"]);
        members[member].profile = "AN";
        members[member].creationDate = now;
        members[member].contributions = 0;
        members[member].exists = true;

        emit AddMember(msg.sender, member, members[member].profile, members[member].creationDate, members[member].contributions);

    }

    function assignProfileToMember(address member, bytes32 profile) public {
        require(members[member].exists);
          //check if new profile can be assign to member given his current profile.
        bytes32 memberProfile = members[member].profile;
        bytes32 _hash = keccak256(memberProfile,profile);
        require(transitionRegister[_hash].initToFinalProfileExists);
        members[member].profile = profile;
        emit AssignProfileToMember(msg.sender, member, profile);  
        //check profile restrictions (time, contributions, etc).
       // Conditions c = transitionRegister[profile][members[member].profile];
        //require(c.initToFinalProfileExists);
       // require(c.requestedTime <= members[member].creationDate);
        //require(c.requestedContributions <= members[member].contributions);
    }

    function addTransition(bytes32 initialProfile, bytes32 finalProfile, uint256 timeCondition, uint256 contributionCondition) public {
        /*Both initial and final profile should exists.*/
        require(profiles[finalProfile]);
        require(profiles[initialProfile]);

        bytes32 _hash = keccak256(initialProfile,finalProfile);
        
        transitionRegister[_hash].initToFinalProfileExists = true;
        transitionRegister[_hash].requestedTime = timeCondition;
        transitionRegister[_hash].requestedContributions = contributionCondition;
        emit AddTransition(msg.sender, initialProfile, finalProfile, timeCondition, contributionCondition);
    }

    function removeTransition(bytes32 initialProfile, bytes32 finalProfile) public {
        bytes32 _hash = keccak256(initialProfile,finalProfile);
        require(transitionRegister[_hash].initToFinalProfileExists);
        transitionRegister[_hash].initToFinalProfileExists = false;
        emit RemoveTransition(msg.sender, initialProfile, finalProfile);
    }
    function changeConditions(bytes32 initialProfile, bytes32 finalProfile , uint256 timeCondition, uint256 contributionCondition) public {
        bytes32 _hash = keccak256(initialProfile,finalProfile);
        require(transitionRegister[_hash].initToFinalProfileExists);
        transitionRegister[_hash].requestedTime = timeCondition;
        transitionRegister[_hash].requestedContributions = contributionCondition;
        emit ChangeConditions(msg.sender, initialProfile, finalProfile, timeCondition, contributionCondition);
    
    }
}
