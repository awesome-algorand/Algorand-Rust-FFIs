import * as ed from "@noble/ed25519";

// Algo Models FFI
import init, {
    type PayTransactionFields,
    encodePayment,
    attachSignature, InitInput,
} from "algo_models";

// TODO: fix importing and mounting wasm for SSR
// import * as wasmMod from "algo_models/wasm"

// Algo Models JS
import * as mod from "@algorandfoundation/algo-models";

import {generateKey, sign} from "./wallet";
import {KeyPairRecord} from "./types";

// Generated ed25519 keypair
const privKey = new Uint8Array([172, 114,  96,  36, 78,  59, 134, 113,
    11, 162, 176, 159,  5,  78, 134,  40,
    137, 245, 101, 179, 72,  56, 192,  85,
    95, 110,  92, 238, 46, 177, 162, 198])

// Log a private key as an example of hybrid operations (Server and Client)
console.log(ed.utils.randomPrivateKey())

// Types for the Results
export type ResultType = "JS" | "FFI" | "WC-JS" | "WC-FFI" | "success"
export type IncludesProp = {
    [k: string]: boolean,
    JS: boolean,
    FFI: boolean,
    "WC-JS": boolean,
    "WC-FFI": boolean,
}
export type TestResult = {
    type: ResultType,
    result: number
}
export type TestResultCallback = (err: Error | null, result: TestResult | null)=>void


// Defaults
const genId = "testnet-v1.0";
const genesisHash = "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=";
const amount = 1000000;
const from = "TIQ4WPFJQYSP2SKLSCDWTK2IIQQ6FOS6BHYIYDGRUZSSROJC5P3HBCZ67Y";
const to = "66LKPOMVQJL2YVMTAVULQVZMZZCD5M2YVWA7KRHEOHYOJU5KLH2PB7HRRY";
const algoCrafter = new mod.AlgorandTransactionCrafter(genId, genesisHash);
const txBuilder = algoCrafter
    .pay(amount, from, to)
    .addFirstValidRound(1000)
    .addLastValidRound(1500)


let nativeKey: KeyPairRecord | undefined;

async function initNativeKey(){
    if(typeof nativeKey === "undefined"){
        nativeKey = await generateKey(true)
    }
}

export async function webCryptoJsTest(iterations: number, payload: number, cb:TestResultCallback){
    await initNativeKey()
    if(typeof nativeKey === 'undefined') throw new Error('Native key is undefined. This should not happen.')

    // TODO: Export the key and use the same for everything
    //const exportedKey = await exportKey(nativeKey)

    const bytesForSigningNative: Uint8Array = txBuilder.get().encode()

    console.log("Native", "start");
    const start = performance.now();
    const plist = []
    for (let i = 0; i < iterations; i++) {
        plist.push(sign(bytesForSigningNative, nativeKey).then((sigNative)=>algoCrafter.addSignature(bytesForSigningNative, sigNative)));
    }
    const result = await Promise.all(plist);
    const end = performance.now();
    console.log("Native", end - start);
    cb(null, {
        type: "WC-JS",
        result: end - start
    })
    return result
}
export async function webCryptoFFITest(iterations: number, payload: number, cb:TestResultCallback){
    await initNativeKey()
    if(typeof nativeKey === 'undefined') throw new Error('Native key is undefined. This should not happen.')


    const tx = txBuilder.get();
    const fields = {
        header: {
            // note: tx.note,
            sender: tx.snd,
            fee: tx.fee,
            transactionType: "Payment",
            firstValid: tx.fv,
            lastValid: tx.lv,
            genesisHash: tx.gh,
            genesisId: tx.gen,
        },
        receiver: tx.rcv,
        amount: tx.amt,
    } as unknown as PayTransactionFields;




    // TODO: Export the key and use the same for everything
    //const exportedKey = await exportKey(nativeKey)

    const btyesForSigning = encodePayment(fields);

    console.log("Native/Rust Start");
    const start = performance.now();
    const plist = []
    for (let i = 0; i < iterations; i++) {
        plist.push(sign(btyesForSigning, nativeKey).then((sigNative)=>attachSignature(btyesForSigning, sigNative)));
    }
    const result = await Promise.all(plist);
    const end = performance.now();
    console.log("Native/Rust Stop", end - start);
    cb(null, {
        type: "WC-FFI",
        result: end - start
    })
    return result
}
export async function jsTest(iterations: number,  payload: number,cb: TestResultCallback){
    console.log("JS Start");
    const bytesForSigningTs: Uint8Array = txBuilder.get().encode(); // encoded msg ready - to be signed with EdDSA
    const start = performance.now();
    const plist = []
   for (let i = 0; i < iterations; i++) {
        // The encoding algorithm is a fork of the actual msgpack (https://github.com/EvanJRichard/msgpack-javascript)
        // After msgpack encoding a TX TAG is added as a prefix to the result.
        plist.push(ed.signAsync(bytesForSigningTs, privKey).then((sigTs)=>algoCrafter.addSignature(bytesForSigningTs, sigTs)));
    }
    const result = await Promise.all(plist);
    const end = performance.now();
    console.log("JS Stop", end - start);
    cb(null, {
        type: "JS",
        result: end - start
    })
    return result
}

export async function ffiTest(iterations: number, payload: number,cb: TestResultCallback){
    const tx = txBuilder.get();
    const fields = {
        header: {
            sender: tx.snd,
            fee: tx.fee,
            transactionType: "Payment",
            firstValid: tx.fv,
            lastValid: tx.lv,
            genesisHash: tx.gh,
            genesisId: tx.gen,
        },
        receiver: tx.rcv,
        amount: tx.amt,
    }  as unknown as PayTransactionFields;
    const btyesForSigning = encodePayment(fields);

    console.log("Rust", "start");
    const start = performance.now();
    const plist = []

    for (let i = 0; i < iterations; i++) {
        // Signing with a ed25519 lib that has no idea about Algorand
        plist.push(ed.signAsync(btyesForSigning, privKey).then((sig)=>attachSignature(btyesForSigning, sig)));
    }
    const result = await Promise.all(plist);
    const end = performance.now();
    console.log("Rust", end - start);
    cb(null, {
        type: "FFI",
        result: end - start
    })
    return result
}

export async function runTests(
    iterations: number,
    payload: number,
    includes: IncludesProp,
    cb: TestResultCallback
) {
    // TODO: Move to top of file and get RSC working
    if(typeof window !== "undefined"){
    await init()
    } //else {
    //     await init(wasmMod as unknown as InitInput);
    // }

    const start = performance.now();

    if (includes["JS"]) {
        await jsTest(iterations, payload, cb)
    }
    if (includes["FFI"]) {
       await ffiTest(iterations, payload, cb)
    }
    if (includes["WC-JS"]) {
        await webCryptoJsTest(iterations, payload, cb)
    }
    if (includes["WC-FFI"]) {
        await webCryptoFFITest(iterations, payload, cb)
    }
    const end = performance.now();

    cb(null, {
        type: "success",
        result: end - start
    })
}