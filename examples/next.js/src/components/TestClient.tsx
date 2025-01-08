"use client";

import {useState} from "react";
import dynamic from "next/dynamic";
import {Pie, Cell, Legend, Tooltip} from 'recharts';


import {runTests, type ResultType, IncludesProp} from "@/lib/test"
// Force PieChart to be loaded client side
const PieChart = dynamic(
    () => (
        import("recharts").then(recharts => recharts.PieChart)
    ),
    {
        ssr: false
    }
);

// Colors for Pie Chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
// Default data for Pie Chart
const DEFAULT_DATA = [
    { name: 'JS', value: 0 },
    { name: 'FFI', value: 0 },
    { name: 'WC-JS', value: 0 },
    { name: 'WC-FFI', value: 0 },
]
// Fake store to abuse state with
let store: {[k: string]: number} = {}

export function TestClient() {
    // State
    const [data, setData] = useState(DEFAULT_DATA)
    const [state, setState] = useState<"waiting" | "testing" | "chart">("waiting")

    // Controls
    const [iterations, setIterations] = useState(1000)
    const [payload, setPayload] = useState(1000)
    const [includes, setIncludes] = useState<IncludesProp>({
        "JS": true,
        "FFI": true,
        "WC-JS": true,
        "WC-FFI": true
    })

    // update includes data
    const handleIncludesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const type = e.target.value as ResultType
        if (e.target.checked && !includes[type]) {
                setIncludes({...includes, [type]: true})
            } else if (!e.target.checked && includes[type]) {
                setIncludes({...includes, [type]: false})
            }
    }

    return <>
        <h1>Status: {state}</h1>
        <PieChart width={800} height={400}>
            <Pie
                label
                data={data}
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} name={entry.name}/>
                ))}
            </Pie>
            <Legend/>
            <Tooltip />
        </PieChart>
        <h1>Controls</h1>
        <form onSubmit={e => e.preventDefault()} style={{
            borderRadius: 5,
            gap: 10,
            padding: 10,
            background: "grey",
            display: "flex",
            flexDirection: "column"
        }}>
            <label style={{display: "flex"}}>
                <strong style={{marginRight: 10}}>Iterations</strong>
                <input style={{flex: 1}} type="number" value={iterations}
                       onChange={e => setIterations(parseInt(e.target.value))}/>
            </label>
            <label style={{display: "flex"}}>
                <strong style={{marginRight: 10}}>Payload</strong>
                <input style={{flex: 1}} type="number" value={payload}
                       onChange={e => setPayload(parseInt(e.target.value))}/>
            </label>
            <div className="combo-checkbox">
                <label><input type="checkbox" value="JS" defaultChecked onChange={handleIncludesChange}/>JS</label>
                <label><input type="checkbox" value="FFI" defaultChecked onChange={handleIncludesChange}/>FFI</label>
                <label><input type="checkbox" value="WC-JS" defaultChecked
                              onChange={handleIncludesChange}/>WC-JS</label>
                <label><input type="checkbox" value="WC-FFI" defaultChecked
                              onChange={handleIncludesChange}/>WC-FFI</label>
            </div>
            <button
                style={{
                    maxWidth: 100,
                    borderRadius: 5,
                    border: 0,
                }}
                onClick={() => {
                    if (state === "testing") return
                    store = {}
                    setState("testing")
                    runTests(iterations, payload, includes, (err, result) => {
                        if (err) throw err
                        if (result?.type === "success") {
                            setData(Object.keys(store).map((k) => {
                                return {
                                    name: k,
                                    value: store[k]
                                }
                            }))
                        } else {
                            if (result != null) {
                                store[result.type] = result.result || 0
                            }
                        }
                    }).then(() => {
                        setState("waiting")
                    })
                }}>
                Run Tests
            </button>
        </form>
    </>
}