use std::any::Any;
use anyhow::Result;
use iroh::{protocol::Router, Endpoint};
use wasm_bindgen::prelude::*;
#[wasm_bindgen(js_name = "start")]
pub async fn yo_home_async() -> Result<JsValue, JsValue>
{
    let endpoint = Endpoint::builder().discovery_n0().bind().await;
    let router = Router::builder(endpoint.unwrap().clone())
        // .accept(ALPN, gossip.clone())
        .spawn().await;

    // Well crud, literally can't use anything. Seems like there is work towards net-reports
    // https://github.com/n0-computer/iroh/tree/matheus23/iroh-net-report-browser

    Ok(JsValue::from_str("Server Did Nothing"))
}



