/* eslint-disable @typescript-eslint/no-explicit-any */
import circuitJSON from './circuits.json';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

function mapKeysToArray(map: Map<any, string>) {
    return Array.from(map.keys()).map((key) => map.get(key)! as `0x${string}`);
}

const setup = async () => {
    await Promise.all([
        import("@noir-lang/noirc_abi").then(module =>
            module.default(new URL("@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm", import.meta.url).toString())
        ),
        import("@noir-lang/acvm_js").then(module =>
            module.default(new URL("@noir-lang/acvm_js/web/acvm_js_bg.wasm", import.meta.url).toString())
        )
    ]);
}

const generateProof = async (input: {
    pub_key_x: number[],
    pub_key_y: number[],
    signature: number[],
    message_hash: number[],
    identifierCode: number,
}) => {
    await setup();

    const backend = new BarretenbergBackend(circuitJSON as any);
    const noir = new Noir(circuitJSON as any, backend);

    console.log('logs', 'Generating proof... ⌛');
    const proof = await noir.generateFinalProof(input);
    console.log('logs', 'Generating proof... ✅');
    console.log('results', proof.proof);

    return {
        proof: "0x" + Buffer.from(proof.proof).toString("hex") as `0x${string}`,
        publicInputs: mapKeysToArray(proof.publicInputs),
    };
}

export { generateProof };