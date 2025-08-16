use super::TwitchEvent;
use crate::events::twitch::TwitchEventData;
use poise::serenity_prelude::{self as serenity, ChannelId};

pub async fn subgift_event(http_client: &serenity::Http, event: TwitchEvent) -> Result<(), String> {
    let chan;
    let username;
    let message;

    match event.data {
        TwitchEventData::Subscription {
            channel: c,
            username: u,
            methods: _,
            tags: _,
            message: m,
        } => {
            chan = c;
            username = u;
            message = m;
        }
        _ => return Err(String::from("TwitchEventData is not of type 'Resub'")),
    };

    let channel = std::env::var("DISCORD_CHANNEL_ID")
        .expect("Expected a DISCORD_CHANNEL_ID environment variable.");
    let id: u64 = channel.parse().unwrap();
    let chann_id = ChannelId::new(id);
    if let Err(e) = http_client.get_channel(chann_id).await {
        return Err(format!("{e:?}"));
    };

    let msg = format!(
        "### 🎉 A new subscriber! `{username}` just subscribed to `{chan}`! \"{}\"",
        message.unwrap_or("".into())
    );

    if let Err(e) = chann_id.say(&http_client, msg).await {
        return Err(format!("{e:?}"));
    }
    Ok(())
}
