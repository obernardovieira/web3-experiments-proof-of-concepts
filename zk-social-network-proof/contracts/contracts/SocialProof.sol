// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IEAS, AttestationRequest, AttestationRequestData} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import {NO_EXPIRATION_TIME, EMPTY_UID} from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

// The interface for the UltraVerifier contract.
interface IUltraVerifier {
    function verify(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external view returns (bool);
}

// Social Proof contract
contract SocialProof is Ownable {
    error InvalidEAS();
    error InvalidProof();
    // The address of the global EAS contract.
    IEAS private immutable eas;
    // The address of the verifier contract.
    IUltraVerifier public ultraVerifier;
    address public attester;
    bytes32 public schemaUID;
    mapping(uint256 => mapping(uint8 => uint8)) public unassignedScores;

    // Events
    event SetUnassignedScore(
        uint256 indexed identifier,
        uint8 network,
        uint8 score
    );
    event ClaimedScore(
        address indexed claimer,
        uint256 indexed identifier,
        uint8 network,
        uint8 score,
        bytes32 attestationUID
    );

    /**
     * @dev Throws if called by any account other than the attester.
     */
    modifier onlyAttester() {
        // TODO: change to "error NotAttester()"
        require(msg.sender == attester, "Not the attester");
        _;
    }

    /**
     * @param _ultraVerifier UltraVerifier contract address
     * @param _eas EAS contract address
     * @param _schemaUID EAS schema UID
     */
    constructor(
        IUltraVerifier _ultraVerifier,
        IEAS _eas,
        bytes32 _schemaUID
    ) Ownable(msg.sender) {
        ultraVerifier = _ultraVerifier;
        eas = _eas;
        schemaUID = _schemaUID;

        if (address(eas) == address(0)) {
            revert InvalidEAS();
        }
    }

    /**
     * Owner can change the EAS schema UID
     * @param _schemaUID EAS schema UID
     */
    function setSchemaUID(bytes32 _schemaUID) external onlyOwner {
        schemaUID = _schemaUID;
    }

    /**
     * Owner can change the UltraVerifier contract address
     * @param _ultraVerifier UltraVerifier contract address
     */
    function setUltraVerifier(IUltraVerifier _ultraVerifier) external onlyOwner {
        ultraVerifier = _ultraVerifier;
    }

    /**
     * Owner can change the attester address
     * @param _attester attester address
     */
    function setAttester(address _attester) external onlyOwner {
        attester = _attester;
    }

    /**
     * Set score for a private identifier and network, temporarily, until it is claimed. Called by the attester.
     * @param _identifier Private identifier
     * @param _network Netowrk id
     * @param _score Score
     */
    function setScore(
        uint256 _identifier,
        uint8 _network,
        uint8 _score
    ) external onlyAttester {
        unassignedScores[_identifier][_network] = _score;
        emit SetUnassignedScore(_identifier, _network, _score);
    }

    /**
     * Claim the score for a private identifier and network. Called by the user itself.
     * @param _identifier Private identifier
     * @param _network Netowrk id
     * @param _proof Proof
     * @param _publicInputs Public inputs
     */
    function claimScore(
        uint256 _identifier,
        uint8 _network,
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external {
        if (!ultraVerifier.verify(_proof, _publicInputs)) {
            revert InvalidProof();
        }
        uint8 _score = uint8(uint256(_publicInputs[0]));
        unassignedScores[_identifier][_network] = 0;
        bytes32 attestationUID = eas.attest(
            AttestationRequest({
                schema: schemaUID,
                data: AttestationRequestData({
                    recipient: msg.sender,
                    expirationTime: NO_EXPIRATION_TIME, // No expiration time
                    revocable: true,
                    refUID: EMPTY_UID, // No references UI
                    data: abi.encode(_network, _score),
                    value: 0 // No value/ETH
                })
            })
        );
        emit ClaimedScore(
            msg.sender,
            _identifier,
            _network,
            _score,
            attestationUID
        );
    }
}
