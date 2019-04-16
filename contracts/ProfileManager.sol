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
    event IncrementContributionsMember(address indexed entity, address member, uint256 contributions);
    //event RemoveProfile(address indexed entity, bytes32 profile);


    mapping(bytes32 => bool) profiles;
    bytes32 defaultProfile = "Anonimo";

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
        profiles["Anonimo"] = true;
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
        require(profiles["Anonimo"]);
        members[member].profile = "Anonimo";
        members[member].creationDate = now;
        members[member].contributions = 0;
        members[member].exists = true;

        emit AddMember(msg.sender, member, members[member].profile, members[member].creationDate, members[member].contributions);

    }

    function assignProfileToMember(address member, bytes32 profile) public {
        require(members[member].exists, "EL MIEMBRO NO EXISTE");
          //check if new profile can be assign to member given his current profile.
        bytes32 memberProfile = members[member].profile;
        bytes32 _hash = keccak256(memberProfile,profile);
        uint256 requestTime = ((now - members[member].creationDate))/(3600*24*30);
        require(transitionRegister[_hash].initToFinalProfileExists, "LA TRANSICION NO EXISTE");
        require(transitionRegister[_hash].requestedTime <= requestTime, "TODAVIA NO HA CUMPLIDO EL TIEMPO REQUERIDO");
        require(transitionRegister[_hash].requestedContributions <= members[member].contributions, "TODAVIA NO TIENE LAS CONTRIBUCIONES REQUERIDAS");
        members[member].profile = profile;
        members[member].creationDate = now;
        members[member].contributions = 0;
        
        //check profile restrictions (time, contributions, etc).
       // Conditions c = transitionRegister[profile][members[member].profile];
        //require(c.initToFinalProfileExists);
       // require(c.requestedTime <= members[member].creationDate);
        //require(c.requestedContributions <= members[member].contributions);
        emit AssignProfileToMember(msg.sender, member, profile);  
    }

    function incrementContributionsMember(address member){
        require(members[member].exists);

        members[member].contributions += 1;

        emit IncrementContributionsMember(msg.sender, member,members[member].contributions);
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
