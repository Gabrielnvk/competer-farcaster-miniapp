// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Contest.sol";

contract ContestFactory {
    address[] public contests;
    mapping(address => address[]) public creatorContests;
    
    event ContestCreated(
        address indexed contestAddress,
        address indexed creator,
        string title,
        uint256 entryFee,
        uint256 maxParticipants,
        uint256 endTime
    );
    
    function createContest(
        string memory _title,
        string memory _description,
        uint256 _entryFee,
        uint256 _maxParticipants,
        uint256 _duration, // in seconds
        uint8 _prizeType // 0: winner-takes-all, 1: top-three, 2: sponsor-funded
    ) external payable returns (address) {
        Contest newContest = new Contest{value: msg.value}(
            _title,
            _description,
            msg.sender,
            _entryFee,
            _maxParticipants,
            block.timestamp + _duration,
            _prizeType
        );
        
        address contestAddress = address(newContest);
        contests.push(contestAddress);
        creatorContests[msg.sender].push(contestAddress);
        
        emit ContestCreated(
            contestAddress,
            msg.sender,
            _title,
            _entryFee,
            _maxParticipants,
            block.timestamp + _duration
        );
        
        return contestAddress;
    }
    
    function getContestCount() external view returns (uint256) {
        return contests.length;
    }
    
    function getCreatorContests(address creator) external view returns (address[] memory) {
        return creatorContests[creator];
    }
    
    function getAllContests() external view returns (address[] memory) {
        return contests;
    }
}
