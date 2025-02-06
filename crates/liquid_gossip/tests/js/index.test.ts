import { expect, test, describe } from "bun:test";
import init, {
    start,
} from "./pkg/liquid_gossip";

describe("algo_models WASM", async () => {
  await init();
  describe('yo hommie', ()=>{
    test('yo', async ()=>{
      const res = await start()
      expect(res).toBe("Server Did Nothing")
    })
  })
});
