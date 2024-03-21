pragma solidity ^0.8.0;

contract Governance {

    struct Proposal {
        address proposer;
        string description;
        address[] forVotes;
        address[] againstVotes;
        bool executed;
    }

    Proposal[] public proposals;

    mapping(address => uint) public voterAction;

    mapping(address => mapping(uint => bool)) public hasVoted;

    event ProposalCreated(address indexed proposer, uint indexed proposalId, string description);

    event VoteCast(address indexed voter, uint indexed proposalId, bool support);

    event ProposalExecuted(uint indexed proposalId);

    modifier proposalExists(uint _proposalId) {
        require(_proposalId < proposals.length, "Proposal does not exist");
        _;
    }

    function createProposal(string memory _description) external {
        uint proposalId = proposals.length;
        proposals.push(Proposal(msg.sender, _description, 0, 0, false));
        emit ProposalCreated(msg.sender, proposalId, _description);
    }

    function castVote(uint _proposalId, bool _support) external proposalExists(_proposalId) {
        require(!hasVoted[msg.sender][_proposalId], "Already voted on this proposal");
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Proposal has already been executed");

        if (_support) {
            proposal.forVotes.push(msg.sender);
        } else {
            proposal.againstVotes.push(msg.sender);

        }

        hasVoted[msg.sender][_proposalId] = true;
        emit VoteCast(msg.sender, _proposalId, _support);
    }

    function executeProposal(uint _proposalId) external proposalExists(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Proposal has already been executed");
        require(proposal.forVotes.length > proposal.againstVotes.length, "Proposal did not pass");

        emit ProposalExecuted(_proposalId);

        proposal.executed = true;
    }

    function connectSuccessfully() pure external returns(bool){
        return true;
    }

    function getProposal() external view returns(Proposal[] memory) {
        return proposals;
    }
}
