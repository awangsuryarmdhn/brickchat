import nacl from "tweetnacl";
import { decodeUTF8, encodeUTF8 } from "tweetnacl-util";

// 1️⃣ buat pasangan kunci
export function generateKeyPair() {
  return nacl.box.keyPair();
}

// 2️⃣ enkripsi pesan
export function encryptMessage(
  message: string,
  receiverPublicKey: Uint8Array,
  senderSecretKey: Uint8Array
) {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  const encrypted = nacl.box(
    decodeUTF8(message),
    nonce,
    receiverPublicKey,
    senderSecretKey
  );

  return {
    nonce: Array.from(nonce),
    ciphertext: Array.from(encrypted)
  };
}

// 3️⃣ dekripsi pesan
export function decryptMessage(
  payload: { nonce: number[]; ciphertext: number[] },
  senderPublicKey: Uint8Array,
  receiverSecretKey: Uint8Array
) {
  const decrypted = nacl.box.open(
    new Uint8Array(payload.ciphertext),
    new Uint8Array(payload.nonce),
    senderPublicKey,
    receiverSecretKey
  );

  if (!decrypted) return null;
  return encodeUTF8(decrypted);
}
