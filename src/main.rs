use chrono::{TimeZone, Utc};
use poise::serenity_prelude as serenity;
use std::env;

struct Data {}

type Error = Box<dyn std::error::Error + Send + Sync>;

type Context<'a> = poise::Context<'a, Data, Error>;

#[poise::command(slash_command, prefix_command)]
async fn ping(ctx: Context<'_>) -> Result<(), Error> {
    let gateway_latency = ctx.ping().await.as_millis();
    let interaction_timestamp = ctx.created_at();
    let now = Utc::now();
    let latency = now.signed_duration_since(*interaction_timestamp);
    let latency_ms = latency.num_milliseconds();

    let response =
        format!("Pong !\nGateway latency: `{gateway_latency}ms`\nUser Latency: `{latency_ms}ms`");
    ctx.say(response).await?;
    Ok(())
}

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

    let commands = vec![ping()];

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
