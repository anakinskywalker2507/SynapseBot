mod cmds;
use cmds::ping;

use poise::serenity_prelude as serenity;
use std::env;

pub struct Data {}

pub type Error = Box<dyn std::error::Error + Send + Sync>;

pub type Context<'a> = poise::Context<'a, Data, Error>;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    dotenvy::dotenv().ok();

    let _twitch_username = env::var("TWITCH_BOT_USERNAME")
        .expect("Expected a TWITCH_BOT_USERNAME environment variable.");
    let _twitch_token = env::var("TWITCH_OAUTH_TOKEN")
        .expect("Expected a TWITCH_OAUTH_TOKEN environment variable.");
    let discord_token =
        env::var("DISCORD_BOT_TOKEN").expect("Expected a DISCORD_BOT_TOKEN environment variable.");

    let commands = vec![ping::ping()];

    let framework = poise::Framework::builder()
        .options(poise::FrameworkOptions {
            commands,
            prefix_options: poise::PrefixFrameworkOptions {
                prefix: Some("!".into()),
                ..Default::default()
            },
            ..Default::default()
        })
        .setup(move |ctx, _ready, framework| {
            Box::pin(async move {
                poise::builtins::register_globally(ctx, &framework.options().commands).await?;
                Ok(Data {})
            })
        })
        .build();

    let intents =
        serenity::GatewayIntents::non_privileged() | serenity::GatewayIntents::MESSAGE_CONTENT;

    let client = serenity::ClientBuilder::new(discord_token, intents)
        .framework(framework)
        .await;
    if let Err(why) = client.unwrap().start().await {
        println!("Client error: {why:?}");
    }
}
