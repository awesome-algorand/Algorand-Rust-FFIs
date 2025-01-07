"use client";
import {main} from "../test.ts"
import {useEffect} from "react";
export function TestClient() {
    useEffect(() => {
        main()
    }, [])
    return <div>Hello</div>
}