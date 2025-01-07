"use server";
import {main} from "../test.ts"
export async function TestServer() {
    await main()
    return <div>Hello</div>
}