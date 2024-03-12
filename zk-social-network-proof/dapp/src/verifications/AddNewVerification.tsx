import React from 'react';
import { postRequestActivityCheck } from '../api';
import { useAccount, useSignMessage } from 'wagmi';
import { useMutation } from '@tanstack/react-query';
import { useIndexedDB } from "react-indexed-db-hook";

interface Props {
    // Define your component's props here
}

const AddNewVerification: React.FC<Props> = () => {
    const { add } = useIndexedDB("verifications");
    const account = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { isPending, isSuccess, isError, mutateAsync, error } = useMutation({
        mutationFn: postRequestActivityCheck
    })
    const [networkId, setNetworkId] = React.useState<string>('');
    const [networkUsername, setNetworkUsername] = React.useState<string>('');

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // Add your form submission logic here
        e.preventDefault();
        const signature = await signMessageAsync({ message: 'Prove account ownership!' })
        console.log(e.currentTarget);
        const { data, status } = await mutateAsync({
            socialNetwork: networkId,
            signature,
            username: networkUsername,
            address: account.address!
        });
        if (status < 400) {
            const { random, dateNow } = data.buildIdentifier;
            const identifierRandom = BigInt(random);
            const identifierDateNow = BigInt(dateNow);
            const identifier = BigInt(account.address!) + identifierRandom * identifierDateNow;
            await add({ identifier, network: networkId, status: '0' })
        }
    }

    return (
        <div>
            <h2>Add New Verification</h2>
            {/* Add your JSX content here */}
            <form onSubmit={handleOnSubmit}>
                <p>Network can be: 1 - discord</p>
                <input type="text" value={networkId} onChange={(e) => setNetworkId(e.target.value)} placeholder="Network" />
                <input type="text" value={networkUsername} onChange={(e) => setNetworkUsername(e.target.value)} placeholder="Network Username" />
                <button type="submit" >Submit</button>
            </form>
            {isPending ? (
                'Sending API request...'
            ) : (
                <>
                    {isError ? (
                        <div>An error occurred: {error.message}</div>
                    ) : null}

                    {isSuccess ? <div>Request successfull!</div> : null}
                </>
            )}
        </div>
    );
};

export default AddNewVerification;