use dep::std;

fn main(
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature: [u8; 64],
    message_hash: [u8; 32],
    identifierCode: Field
) -> pub Field {
    let valid_signature = std::ecdsa_secp256k1::verify_signature(pub_key_x, pub_key_y, signature, message_hash);
    assert(valid_signature);

    // TODO: compute idenfier once bigint is available
    identifierCode
}

#[test]
fn test_compute_and_verify_hash() {
    // main(
    //     [/* pubKeyXBytes */],
    //     [/* pubKeyYBytes */],
    //     [/* signatureBytes */],
    //     [/* messageHashBytes */],
    //     1
    // )
}
