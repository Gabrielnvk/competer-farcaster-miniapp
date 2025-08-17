// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Contest {
    struct ContestInfo {
        string title;
        string description;
        address creator;
        uint256 entryFee;
        uint256 maxParticipants;
        uint256 endTime;
        uint8 prizeType; // 0: winner-takes-all, 1: top-three, 2: sponsor-funded
        bool isActive;
        bool prizesDistributed;
    }
    
    ContestInfo public contestInfo;
    address[] public participants;
    mapping(address => bool) public hasJoined;
    mapping(address => uint256) public participantIndex;
    
    uint256 public prizePool;
    address[] public winners;
    mapping(address => uint256) public prizes;
    
    // Platform fee (2%)
    uint256 public constant PLATFORM_FEE = 200; // 2% in basis points
    address public constant PLATFORM_WALLET = 0x1234567890123456789012345678901234567890; // Replace with actual platform wallet
    
    event ParticipantJoined(address indexed participant, uint256 timestamp);
    event ContestEnded(address[] winners, uint256[] prizes);
    event PrizeDistributed(address indexed winner, uint256 amount);
    
    modifier onlyCreator() {
        require(msg.sender == contestInfo.creator, "Only creator can call this function");
        _;
    }
    
    modifier contestActive() {
        require(contestInfo.isActive, "Contest is not active");
        require(block.timestamp < contestInfo.endTime, "Contest has ended");
        _;
    }
    
    modifier contestEnded() {
        require(block.timestamp >= contestInfo.endTime || !contestInfo.isActive, "Contest is still active");
        _;
    }
    
    constructor(
        string memory _title,
        string memory _description,
        address _creator,
        uint256 _entryFee,
        uint256 _maxParticipants,
        uint256 _endTime,
        uint8 _prizeType
    ) payable {
        contestInfo = ContestInfo({
            title: _title,
            description: _description,
            creator: _creator,
            entryFee: _entryFee,
            maxParticipants: _maxParticipants,
            endTime: _endTime,
            prizeType: _prizeType,
            isActive: true,
            prizesDistributed: false
        });
        
        // If sponsor-funded, add the initial prize pool
        if (_prizeType == 2 && msg.value > 0) {
            prizePool += msg.value;
        }
    }
    
    function join() external payable contestActive {
        require(!hasJoined[msg.sender], "Already joined this contest");
        require(participants.length < contestInfo.maxParticipants, "Contest is full");
        require(msg.value == contestInfo.entryFee, "Incorrect entry fee");
        
        participants.push(msg.sender);
        hasJoined[msg.sender] = true;
        participantIndex[msg.sender] = participants.length - 1;
        
        // Add entry fee to prize pool (for entry fee contests)
        if (contestInfo.prizeType != 2) {
            prizePool += msg.value;
        }
        
        emit ParticipantJoined(msg.sender, block.timestamp);
    }
    
    function endContest() external onlyCreator contestEnded {
        require(!contestInfo.prizesDistributed, "Prizes already distributed");
        contestInfo.isActive = false;
        
        if (participants.length == 0) {
            return; // No participants, nothing to distribute
        }
        
        _distributePrizes();
    }
    
    function _distributePrizes() internal {
        require(participants.length > 0, "No participants");
        
        uint256 platformFee = (prizePool * PLATFORM_FEE) / 10000;
        uint256 totalPrizeAmount = prizePool - platformFee;
        
        // Send platform fee
        if (platformFee > 0) {
            payable(PLATFORM_WALLET).transfer(platformFee);
        }
        
        if (contestInfo.prizeType == 0) {
            // Winner takes all
            _distributePrizesWinnerTakesAll(totalPrizeAmount);
        } else if (contestInfo.prizeType == 1) {
            // Top 3 split
            _distributePrizesTopThree(totalPrizeAmount);
        }
        
        contestInfo.prizesDistributed = true;
    }
    
    function _distributePrizesWinnerTakesAll(uint256 totalPrizeAmount) internal {
        // For demo purposes, we'll use a simple random selection
        // In production, this would integrate with the judging mechanism
        uint256 winnerIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % participants.length;
        address winner = participants[winnerIndex];
        
        winners.push(winner);
        prizes[winner] = totalPrizeAmount;
        
        payable(winner).transfer(totalPrizeAmount);
        emit PrizeDistributed(winner, totalPrizeAmount);
    }
    
    function _distributePrizesTopThree(uint256 totalPrizeAmount) internal {
        uint256 participantCount = participants.length;
        
        if (participantCount == 1) {
            _distributePrizesWinnerTakesAll(totalPrizeAmount);
            return;
        }
        
        // Simple random selection for demo - in production would use proper judging
        uint256[] memory winnerIndices = new uint256[](participantCount >= 3 ? 3 : participantCount);
        bool[] memory used = new bool[](participantCount);
        
        for (uint256 i = 0; i < winnerIndices.length; i++) {
            uint256 randomIndex;
            do {
                randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, i))) % participantCount;
            } while (used[randomIndex]);
            
            used[randomIndex] = true;
            winnerIndices[i] = randomIndex;
        }
        
        // Distribute prizes: 50%, 30%, 20%
        uint256[] memory prizePercentages = new uint256[](3);
        prizePercentages[0] = 5000; // 50%
        prizePercentages[1] = 3000; // 30%
        prizePercentages[2] = 2000; // 20%
        
        for (uint256 i = 0; i < winnerIndices.length; i++) {
            address winner = participants[winnerIndices[i]];
            uint256 prizeAmount = (totalPrizeAmount * prizePercentages[i]) / 10000;
            
            winners.push(winner);
            prizes[winner] = prizeAmount;
            
            payable(winner).transfer(prizeAmount);
            emit PrizeDistributed(winner, prizeAmount);
        }
    }
    
    function getParticipants() external view returns (address[] memory) {
        return participants;
    }
    
    function getWinners() external view returns (address[] memory) {
        return winners;
    }
    
    function getParticipantCount() external view returns (uint256) {
        return participants.length;
    }
    
    function isParticipant(address user) external view returns (bool) {
        return hasJoined[user];
    }
    
    function getContestDetails() external view returns (
        string memory title,
        string memory description,
        address creator,
        uint256 entryFee,
        uint256 maxParticipants,
        uint256 endTime,
        uint8 prizeType,
        bool isActive,
        bool prizesDistributed,
        uint256 currentPrizePool,
        uint256 participantCount
    ) {
        return (
            contestInfo.title,
            contestInfo.description,
            contestInfo.creator,
            contestInfo.entryFee,
            contestInfo.maxParticipants,
            contestInfo.endTime,
            contestInfo.prizeType,
            contestInfo.isActive,
            contestInfo.prizesDistributed,
            prizePool,
            participants.length
        );
    }
    
    // Emergency functions
    function emergencyWithdraw() external onlyCreator {
        require(block.timestamp > contestInfo.endTime + 7 days, "Emergency withdrawal not yet available");
        require(!contestInfo.prizesDistributed, "Prizes already distributed");
        
        payable(contestInfo.creator).transfer(address(this).balance);
    }
    
    function pauseContest() external onlyCreator {
        contestInfo.isActive = false;
    }
    
    function resumeContest() external onlyCreator {
        require(block.timestamp < contestInfo.endTime, "Contest time has passed");
        contestInfo.isActive = true;
    }
}
