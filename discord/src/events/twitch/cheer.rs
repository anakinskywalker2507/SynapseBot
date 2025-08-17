use super::TwitchEvent;
use crate::events::twitch::TwitchEventData;
use poise::serenity_prelude::{self as serenity, ChannelId};

pub async fn cheer_event(http_client: &serenity::Http, event: TwitchEvent) -> Result<(), String> {
    let chan;
    let mut userstate;
    let message;
    let bits;

    match event.data {
        TwitchEventData::Cheer {
            channel: c,
            userstate: u,
            message: m,
            bits: b,
        } => {
            chan = c;
            userstate = u;
            message = m;
            bits = b;
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

    let dn = userstate["display-name"].take();
    let display_name = dn.as_str().unwrap_or("Error: No Name");

    let msg = format!(
        "### ✨ `{display_name}` just cheered with __{bits}__ bits to `{chan}`! Message: \"`{message}`\""
    );

    if let Err(e) = chann_id.say(&http_client, msg).await {
        return Err(format!("{e:?}"));
    }
    Ok(())
}
