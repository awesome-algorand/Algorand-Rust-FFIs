// Let's Build advanced sdk functionality here.
// Typescript is a fail, we will have to hand-craft the bindings so just ignore JS/TS
// We can leverage the shared `models` package in all packages

#[tokio::main]
async fn main() {
    let configuration = algo_fetch::apis::configuration::Configuration{
        base_path: String::from("https://testnet-api.4160.nodely.dev"),
        user_agent: None,
        client: Default::default(),
        basic_auth: None,
        oauth_access_token: None,
        bearer_access_token: None,
        api_key: None,
    };
    let round = 500;
    let block_result = algo_fetch::apis::public_api::get_block(&configuration, round, None).await;
    print!("{:?}", block_result);
}
