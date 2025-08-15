use poise::serenity_prelude::{self as serenity, EventHandler};
use serde::Deserialize;
use std::{env, fs, path::Path};

mod cmds;
mod events;

pub struct Data {
    color: (u8, u8, u8),
}

pub type Error = Box<dyn std::error::Error + Send + Sync>;

pub type Context<'a> = poise::Context<'a, Data, Error>;

#[derive(Deserialize, Debug)]
struct Config {
    discord_prefix: String,
    color: [u8; 3],
}

fn load_config<P: AsRef<Path>>(path: P) -> Result<Config, Box<dyn std::error::Error>> {
    let file_contents = fs::read_to_string(path)?;
    let config: Config = serde_json::from_str(&file_contents)?;
    Ok(config)
}

struct Handler;

#[poise::async_trait]
impl EventHandler for Handler {
    async fn message(&self, ctx: serenity::Context, new_message: serenity::Message) {
        if new_message.author.id != ctx.cache.current_user().id {
            events::message_create::message_create(new_message).await;
        }
    }
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

    let commands = cmds::get_all_commands();

    let config = load_config("config.json").expect("Failed to load config.json");

    let color = (config.color[0], config.color[1], config.color[2]);

    let framework = poise::Framework::builder()
        .options(poise::FrameworkOptions {
            commands,
            prefix_options: poise::PrefixFrameworkOptions {
                prefix: Some(config.discord_prefix),
                ..Default::default()
            },
            ..Default::default()
        })
        .setup(move |ctx, _ready, framework| {
            Box::pin(async move {
                poise::builtins::register_globally(ctx, &framework.options().commands).await?;
                Ok(Data { color })
            })
        })
        .build();

    let intents = serenity::GatewayIntents::non_privileged()
        | serenity::GatewayIntents::MESSAGE_CONTENT
        | serenity::GatewayIntents::GUILD_MESSAGES;

    let client = serenity::ClientBuilder::new(discord_token, intents)
        .framework(framework)
        .event_handler(Handler)
        .await;
    if let Err(why) = client.unwrap().start().await {
        println!("Client error: {why:?}");
    }
}
