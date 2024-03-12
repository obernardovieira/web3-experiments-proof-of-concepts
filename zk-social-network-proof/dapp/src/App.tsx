import { useAccount, useConnect, useDisconnect } from 'wagmi'
import Verifications from './verifications'
import { scrollSepolia } from 'viem/chains'

function App() {
	const account = useAccount()
	const { connectors, connect, status, error } = useConnect()
	const { disconnect } = useDisconnect()

	if (account.status === 'connected') {
		return (
			<div>
				<h2>Account</h2>

				<div>
					status: {account.status}
					<br />
					addresses: {JSON.stringify(account.addresses)}
					<br />
					chainId: {account.chainId}
				</div>

				{account.status === 'connected' && (
					<button type="button" onClick={() => disconnect()}>
						Disconnect
					</button>
				)}

				<h2>Verifications</h2>

				<Verifications />
			</div>
		)
	}

	return (
		<div>
			<h2>Connect</h2>
			{connectors.map((connector) => (
				<button
					key={connector.uid}
					onClick={() => connect({ connector, chainId: scrollSepolia.id })}
					type="button"
				>
					{connector.name}
				</button>
			))}
			<div>{status}</div>
			<div>{error?.message}</div>
		</div>
	)
}

export default App
