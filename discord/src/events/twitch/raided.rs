use super::TwitchEvent;
use crate::events::twitch::TwitchEventData;
use poise::serenity_prelude::{self as serenity, ChannelId};

pub async fn raided_event(http_client: &serenity::Http, event: TwitchEvent) -> Result<(), String> {
    let chan;
    let username;
    let viewers;

    match event.data {
        TwitchEventData::Raided {
            channel: c,
            username: u,
            viewers: v,
        } => {
            chan = c;
            username = u;
            viewers = v;
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

    let msg = format!("### 🚀 `{username}` started a raid with __{viewers}__ viewers to `{chan}`!");

    if let Err(e) = chann_id.say(&http_client, msg).await {
        return Err(format!("{e:?}"));
    }
    Ok(())
}
