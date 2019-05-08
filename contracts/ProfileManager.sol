pragma solidity >=0.4.22 <0.6.0;

import "@aragon/os/contracts/apps/AragonApp.sol";

contract ProfileManager is AragonApp {

    bytes32[] arrayProfiles;
    bytes32 constant public INCREMENT_ROLE = keccak256("INCREMENT_ROLE");
    bytes32 constant public DECREMENT_ROLE = keccak256("DECREMENT_ROLE");

    //Profile events.
    event AddProfile(address indexed entity, bytes32 profile);
    event RemoveProfile(address indexed entity, bytes32 profile);
    event AddTransition(address indexed entity, bytes32 initialProfile, bytes32 finalProfile, uint256 timeCondition, uint256 contributionCondition, bytes32 _hash);
    event ChangeConditions(address indexed entity, bytes32 initialProfile, bytes32 finalProfile, uint256 timeCondition, uint256 contributionCondition);
    event RemoveTransition(address indexed entity, bytes32 initialProfile, bytes32 finalProfile);
    event AssignProfileToMember(address indexed entity, address member, bytes32 profile);
    event AddMember(address indexed entity, address member, bytes32 profile, uint256 creationDate, uint256 contributions);
    event IncrementContributionsMember(address indexed entity, address member, uint256 contributions);
    //event RemoveProfile(address indexed entity, bytes32 profile);


    mapping(bytes32 => bool) public profiles;
    

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

    mapping(address => Member) members;

    /*key: destinyProfile | value: (key : initialProfile | value: Necessary conditions to pass from one profile to another)*/
    mapping(bytes32 => Conditions) public transitionRegister;

    function initialize() onlyInit public {
        bytes32 defaultProfile = "Anonymous";
        profiles[defaultProfile] = true;
        arrayProfiles.push(defaultProfile);
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
       require(profiles[profileToRemove],"Profile doesn't exist");
     
       uint j = 0;
        while(arrayProfiles.length > j){
            bytes32 _hash1 = keccak256(arrayProfiles[j],profileToRemove);//todos los perfiles a profileToRemove
            bytes32 _hash2 = keccak256(profileToRemove,arrayProfiles[j]);
            require(!transitionRegister[_hash1].initToFinalProfileExists,"There are transitions that include this profile");
            require(!transitionRegister[_hash2].initToFinalProfileExists,"There are transitions that include this profile"); 
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
    
    /**
      * @notice Member with address  "`member`" will be added
      * @param member Address of the member to be added
      */
     function addMember(address member) public {
        require(!members[member].exists,"The member exists");
        require(profiles["Anonymous"]);
        members[member].profile = "Anonymous";
        members[member].creationDate = now;
        members[member].contributions = 0;
        members[member].exists = true;

        emit AddMember(msg.sender, member, members[member].profile, members[member].creationDate, members[member].contributions);

    }

    /**
      * @notice The profile "`profile`" will be assigned to the member "`member`"
      * @param member Address of the member
      * @param profile Profile to assign
      */
    function assignProfileToMember(address member, bytes32 profile) public {
        require(members[member].exists, "Member doesn't exist");
          //check if new profile can be assign to member given his current profile.
        bytes32 memberProfile = members[member].profile;
        bytes32 _hash = keccak256(memberProfile,profile);
        uint256 requestTime = ((now - members[member].creationDate))/(3600*24);
        require(transitionRegister[_hash].initToFinalProfileExists, "The transition doesn't exist");
        require(transitionRegister[_hash].requestedTime <= requestTime, "The required time has not been reached");
        require(transitionRegister[_hash].requestedContributions <= members[member].contributions, "The necessary contributions have not yet been made");
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

    /**
      * @notice Increment one contribution of  "`member`" 
      * @param member Name of the profile to be added
    */
    function incrementContributionsMember(address member) auth (INCREMENT_ROLE){
        require(members[member].exists,"Member doesn't exist");

        members[member].contributions += 1;

        emit IncrementContributionsMember(msg.sender, member,members[member].contributions);
    }

    /**
      * @notice Add transition from profile "`@fromHex(initialProfile)`" to profile "`@fromHex(finalProfile)`" with time "`timeCondition`" and contributions "`contributionCondition`"
      * @param initialProfile Name of the profile to be added
      * @param finalProfile sadas
      * @param timeCondition asdasd
      * @param contributionCondition asdad
      */
    function addTransition(bytes32 initialProfile, bytes32 finalProfile, uint256 timeCondition, uint256 contributionCondition) public {
        /*Both initial and final profile should exists.*/
        require(profiles[finalProfile],"The final profile does not exist");
        require(profiles[initialProfile],"The initial profile does not exist");

        bytes32 _hash = keccak256(initialProfile,finalProfile);
        
        require(!transitionRegister[_hash].initToFinalProfileExists,"The transition exists.");

        transitionRegister[_hash].initToFinalProfileExists = true;
        transitionRegister[_hash].requestedTime = timeCondition;
        transitionRegister[_hash].requestedContributions = contributionCondition;
        emit AddTransition(msg.sender, initialProfile, finalProfile, timeCondition, contributionCondition,_hash);
    }
    /**
      * @notice Remove transition from profile "`@fromHex(initialProfile)`" to profile "`@fromHex(finalProfile)`"
      * @param initialProfile Name of the  initial profile
      * @param finalProfile Name of the final profile 
      */
    function removeTransition(bytes32 initialProfile, bytes32 finalProfile) public {
        bytes32 _hash = keccak256(initialProfile,finalProfile);
        require(transitionRegister[_hash].initToFinalProfileExists,"The transition doesn't exist");
        transitionRegister[_hash].initToFinalProfileExists = false;
        emit RemoveTransition(msg.sender, initialProfile, finalProfile);
    }
    /**
      * @notice Change conditions from profile "`@fromHex(initialProfile)`" to profile "`@fromHex(finalProfile)`" with time "`timeCondition`" and contributions "`contributionCondition`"
      * @param initialProfile Name of the profile to be added
      * @param finalProfile sadas
      * @param timeCondition asdasd
      * @param contributionCondition asdad
      */

    function changeConditions(bytes32 initialProfile, bytes32 finalProfile , uint256 timeCondition, uint256 contributionCondition) public {
        bytes32 _hash = keccak256(initialProfile,finalProfile);
        require(transitionRegister[_hash].initToFinalProfileExists,"The transition doesn't exist.");
        require(timeCondition > 0, "The time has to be greater than zero");
        require(contributionCondition >= 0,"Contributions that have to be greater than or equal to zero");

        transitionRegister[_hash].requestedTime = timeCondition;
        transitionRegister[_hash].requestedContributions = contributionCondition;
        emit ChangeConditions(msg.sender, initialProfile, finalProfile, timeCondition, contributionCondition);
    
    }
}
