import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

dotenv.config();

const config: HardhatUserConfig = {
	solidity: {
		version: "0.8.24",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			}
		}
	},
	networks: {
		scrollTestnet: {
			url: process.env.SCROLL_TESTNET_URL || "",
			accounts:
				process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
		},
	},
  etherscan: {
		apiKey: {
			scrollSepolia: process.env.SCROLLSCAN_API_KEY!,
		},
		customChains: [
			{
				network: "scrollSepolia",
				chainId: 534351,
				urls: {
					apiURL: "https://api-sepolia.scrollscan.com/api",
					browserURL: "https://api-sepolia.scrollscan.com/",
				},
			},
		],
	},
	sourcify: {
		enabled: false
	}
};

export default config;
