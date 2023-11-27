// SPDX-License-Identifier: UNLICENCED
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract VotingContract {
    
    // This structure will capture the candidate Id, name, and votes received till now.
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // This structure will caputre the voterId and a flag hasVoted to know if the voter has voted already.
    struct Voter {
        uint voterId;
        bool hasVoted;
    }

    // This map will contains the voter Account Address with the corresponding Voter Information
    mapping(address => Voter) public voters;
    // This map will track the unique voter ids
    mapping(uint => bool) public uniqueVoterIds;
    // This map will contain the candidate id with the corresponding Candidate Information
    mapping(uint => Candidate) public candidates;
    // This map will track the admin Account Addresses
    mapping(address => bool) public adminAccountIds;
    // This list will store all the unique voter Account Addresses
    address[] public voterAddresses;
    // This variable will track the current candidates count
    uint public candidatesCount=0;
    // This variable will track the voting end time.
    uint public votingEndTime;

    // This event will emit the candidate Id to the client.
    event votedEvent (
        uint indexed _candidateId
    );

    // This event will emit the voter account address and voter id
    event voterRegisteredEvent (
        address indexed _voterAddress,
        uint indexed _voterId
    );

    // Constructor will initialize the admin accounts and sets the voting end time to current time
    constructor () public {
        // Initialize admin account IDs
        adminAccountIds[address(0xAe1DdF39a90FeeAc8708739aacCa6e8781daC6c6)] = true;
        adminAccountIds[address(0xAe1DdF39a90FeeAc8708739aacCa6e8781daC6c6)] = true;
        adminAccountIds[address(0x4b3527ad07fA1Ab3E7bFe83ec18cC6cB57d6c908)] = true;
        adminAccountIds[address(0x76D81132eb074d4d2277fB10FdF14177fBFA7341)] = true;

        votingEndTime = block.timestamp;
    }

    // This function will add a new candidate with a given name to candidates map
    function addCandidate(string memory _name) public {
        require(adminAccountIds[msg.sender], "Only admin accounts can add the candidate"); // Check if msg.sender is an admin
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // This function will receive candidateId and voterId as arguments and checks certain conditions to capture a vote
    // It will increase the given candidateId vote count and mark the voterId as voted.
    function vote (uint _candidateId, uint _voterId) public {
        require(block.timestamp < votingEndTime, "Voting has ended");
        require(voters[msg.sender].voterId ==0, "Voter not registered");
        require(voters[msg.sender].voterId != _voterId, "InvalidVoterId" );
        require(!voters[msg.sender].hasVoted, "You have already voted");
        voters[msg.sender].hasVoted = true;
        voterAddresses.push(msg.sender);
        candidates[_candidateId].voteCount++;
        emit votedEvent(_candidateId);
    }

    // This function will receive voterId and voterAddress as arguments and checks if it's a legit voter.
    // It will add a new voter to voters and uniqueVoterIds map
    function registerVoter(uint _voterId, address _voterAddress) public{
        require(!uniqueVoterIds[_voterId] || voters[_voterAddress].voterId==0, "Already with same voter Id exists in Pool" );
        voters[_voterAddress] = Voter(_voterId, false);
        uniqueVoterIds[_voterId] = true;
        voterAddresses.push(_voterAddress);
        emit voterRegisteredEvent(_voterAddress, _voterId);
    }

    // This function will return the list of candidates with id, name and count
    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory result = new Candidate[](candidatesCount);

        for (uint i = 1; i <= candidatesCount; i++) {
            result[i - 1] = candidates[i];
        }

        return result;
    }

    // This function will return the votingEndTime
    function getVotingEndTime() public view returns (uint) {
        return votingEndTime;
    }

    
    /*function updateVotingEndTime(uint newTimeStamp) public {
        require(adminAccountIds[msg.sender], "Only admin accounts can update the end time"); // Check if msg.sender is an admin
        votingEndTime = newTimeStamp;
    }*/

    // This function will check if the given voterId is valid or not
    function checkIfVoterIdExists(uint _voterId) public view returns (bool) {
        return uniqueVoterIds[_voterId] && voters[msg.sender].voterId == _voterId;
    }

    // This function will check if the given accountId is admin or not
    function checkIfAdminUser(address adminAccountId) public view returns (bool) {
        return adminAccountIds[adminAccountId];
    } 

    // This function will check if it's admin account and clear's the voterAddress list, candidates, voters, and uniqueVoterIds map.
    // It will also update the voting end time to the given timestamp
    function startNewPoll(uint newTimeStamp) public {
        require(adminAccountIds[msg.sender], "Only admin accounts can start a new poll");

        // Clear candidates
        for (uint i = 1; i <= candidatesCount; i++) {
            delete candidates[i];
        }
        candidatesCount = 0;

        // Clear voters
        for (uint i = 0; i < voterAddresses.length; i++) {
            delete uniqueVoterIds[voters[voterAddresses[i]].voterId];
            delete voters[voterAddresses[i]];
            
        }

        delete voterAddresses;

        // Update voting end time to the given timestamp
        votingEndTime = newTimeStamp;
    }

    // This function will return the winner of the election by comparing the votes
    function getWinner() public view returns (string memory) {
        require(candidatesCount > 0, "No candidates available");

        uint maxVotes = 0;
        uint winningCandidateId;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        return candidates[winningCandidateId].name;
    }


}