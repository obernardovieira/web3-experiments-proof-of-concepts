import {
    createWalletClient,
    createPublicClient,
    http,
    getContract,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { scrollSepolia } from "viem/chains";
import fastify from "fastify";
import { contractAbi } from "./contractAbi";
import type { FastifyRequest } from "fastify";
import { randomBytes } from "node:crypto";
import { config as dotenvConfig } from "dotenv";
import cors from '@fastify/cors'

dotenvConfig();

interface BodyType {
    socialNetwork: string;
    username: string;
    signature: string;
    address: `0x${string}`;
}

// chain related variables
const contractAddresses = {
    scrollSepolia: {
        SocialProof: "0x24dc3288f0eb3dc2b206f3defe72e49514046ecc" as `0x${string}`,
    },
};
const account = privateKeyToAccount(
    process.env.ATTESTER_PRIVATE_KEY! as `0x${string}`
);
const client = createWalletClient({
    account,
    chain: scrollSepolia,
    transport: http(),
});
const publicClient = createPublicClient({
    chain: scrollSepolia,
    transport: http(),
});
const contract = getContract({
    address: contractAddresses.scrollSepolia.SocialProof,
    abi: contractAbi,
    client: { public: publicClient, wallet: client },
});

// server related variables
const server = fastify();
server.register(cors)

function mapSocialNetwork(socialNetwork: string) {
    switch (socialNetwork) {
        case "discord":
            return 1;
        case "whatsapp":
            return 2;
        default:
            throw new Error("Invalid social network");
    }
}

server.post(
    "/activity-check",
    async (request: FastifyRequest<{ Body: BodyType }>, reply) => {
        const { socialNetwork, address } = request.body;

        try {
            const identifierRandom = BigInt(`0x${randomBytes(16).toString("hex")}`);
            const identifierDateNow = BigInt(Date.now());
            const identifier = BigInt(address) + identifierRandom * identifierDateNow;

            new Promise(async (resolve, reject) => {
                const network = mapSocialNetwork(socialNetwork);
                const score = 5;
                const tx = await contract.write.setScore([identifier, network, score]);
                console.log(tx);
                publicClient
                    .waitForTransactionReceipt({ hash: tx })
                    .then(console.log)
                    .catch(console.error);

                const unwatch = contract.watchEvent.SetUnassignedScore(
                    {
                        identifier,
                    },
                    {
                        onLogs: (logs) => {
                            console.log('logs', logs);
                            unwatch();
                        },
                    }
                );
                resolve(0);
            });
            reply.send({ status: true, buildIdentifier: { random: identifierRandom.toString(), dateNow: identifierDateNow.toString() } });
        } catch (error) {
            console.error(error);
            reply.status(500).send({ status: false });
        }
    }
);

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
