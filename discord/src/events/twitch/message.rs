use super::TwitchEvent;
use crate::events::twitch::TwitchEventData;
use poise::serenity_prelude::{self as serenity, ChannelId};

pub async fn message_event(http_client: &serenity::Http, event: TwitchEvent) -> Result<(), String> {
    let chan;
    let mut tags;
    let message;

    match event.data {
        TwitchEventData::Message {
            channel: c,
            tags: t,
            message: m,
            is_self,
        } => {
            if is_self && m.clone().is_some_and(|m| m.starts_with("~")) {
                return Ok(());
            }
            chan = c;
            tags = t;
            message = m;
        }
        _ => return Err(String::from("TwitchEventData is not of type 'Message'")),
    };

    let channel = std::env::var("DISCORD_CHANNEL_ID")
        .expect("Expected a DISCORD_CHANNEL_ID environment variable.");
    let id: u64 = channel.parse().unwrap();
    let chann_id = ChannelId::new(id);
    if let Err(e) = http_client.get_channel(chann_id).await {
        return Err(format!("{e:?}"));
    };

    let dn = tags["display-name"].take();
    let display_name = dn.as_str().unwrap_or("Error: No Name");

    let msg = match message {
        Some(m) => m,
        None => "No message".into(),
    };

    let msg = format!("**(`{chan}`)** `{display_name}`: {msg}");

    if let Err(e) = chann_id.say(&http_client, msg).await {
        return Err(format!("{e:?}"));
    }
    Ok(())
}
