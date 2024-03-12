import React, { useEffect, useState } from 'react';
import { useIndexedDB } from "react-indexed-db-hook";
import {
    type BaseError, useWalletClient, useWriteContract, useWaitForTransactionReceipt
} from 'wagmi';
import { hashMessage, recoverPublicKey } from 'viem';
import { generateProof } from '../zk-circuit/circuit';
import { contractAbi } from '../network/contractAbi';

interface Props {
    // Define your component's props here
}

type Verification = {
    id: number;
    identifier: string;
    network: string;
    status: string;
};

const convertToBytes = (input: string) => new Uint8Array(Buffer.from(input, 'hex'));

const ClaimVerification: React.FC<Props> = () => {
    const { data: walletClient } = useWalletClient();
    const { data: hash, error, isPending, writeContract } = useWriteContract()
    const { getAll, update } = useIndexedDB("verifications");
    const [verifications, setVerifications] = useState<Verification[]>([]);

    useEffect(() => {
        console.log('useEffect');
        getAll().then((v) => {
            console.log('v', v);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setVerifications(v as any);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnSubmit = async (data: { id: number, identifier: string, network: string}) => {
        if (!walletClient) {
            return;
        }
        const { id, identifier, network } = data;
        const message = 'Prove account ownership!';
        const hashedMessage = hashMessage(message);
        const signature = await walletClient.signMessage({
            account: walletClient.account,
            message
        });
        const recoveredPublicKey = await recoverPublicKey({ hash: hashedMessage, signature });

        // Remove the initial '0x04' and work with the rest
        // Convert public key coordinates
        const pubKeyXBytes = convertToBytes(recoveredPublicKey.slice(4, 68));
        const pubKeyYBytes = convertToBytes(recoveredPublicKey.slice(68));

        // Convert hashed message
        const messageHashBytes = convertToBytes(hashedMessage.slice(2));

        // Convert signature
        const signatureBytes = convertToBytes(signature.slice(2, -2));

        // Call the generateProof function
        const { proof, publicInputs } = await generateProof({
            pub_key_x: Array.from(pubKeyXBytes),
            pub_key_y: Array.from(pubKeyYBytes),
            signature: Array.from(signatureBytes),
            message_hash: Array.from(messageHashBytes),
            identifierCode: 65
        });

        console.log('proof', proof);
        console.log('publicInputs', publicInputs);
        console.log('identifier', identifier);
        console.log('network', network);

        writeContract({
            abi: contractAbi,
            address: '0x24dc3288f0eb3dc2b206f3defe72e49514046ecc',
            functionName: 'claimScore',
            args: [
                BigInt(identifier),
                2, // parseInt(network, 10),
                proof,
                publicInputs,
            ],
            account: walletClient.account
        }, {
            onSettled: (data) => {
                console.log('onSettled', data);
            },
            onSuccess: (data) => {              
                console.log('onSuccess', data);
                update({ id, identifier, network, status: '1' });
            },
            onError: (error) => {
                console.log('onError', error);
            }
        });
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    return (
        <div>
            <h2>Claim Verification</h2>
            <h3>Current active and pending verifications</h3>
            {verifications.map(({ id, identifier, network, status }) => (
                <div key={id}>
                    <div>Identifier: {identifier}</div>
                    <div>Network: {network}</div>
                    <div>Status: {status === '0' ? <button
                disabled={isPending} onClick={() => handleOnSubmit({ id, identifier, network })}>{isPending ? 'Confirming...' : 'Claim'} </button> : 'Verified'}</div>
                </div>
            ))}
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </div>
    );
};

export default ClaimVerification;