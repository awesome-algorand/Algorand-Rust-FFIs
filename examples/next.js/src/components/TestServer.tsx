"use server";
import {runTests} from "@/lib/test"
export async function TestServer() {
    //TODO: Fix ME
    await runTests(1000, 1000, {JS: true, "WC-FFI": true, FFI: true, "WC-JS": true}, ()=>{
        console.log("test")
    })
    return <div>Hello</div>
}