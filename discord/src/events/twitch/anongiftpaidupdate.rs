use super::TwitchEvent;
use crate::events::twitch::TwitchEventData;
use poise::serenity_prelude::{self as serenity, ChannelId};

pub async fn anongiftpaidupdate_event(
    http_client: &serenity::Http,
    event: TwitchEvent,
) -> Result<(), String> {
    let chan;
    let mut userstate;
    let gift_count;

    match event.data {
        TwitchEventData::AnonGiftPaidUpdate {
            channel: c,
            userstate: u,
            gift_count: g,
        } => {
            chan = c;
            userstate = u;
            gift_count = g;
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
        "### 🎉 A new subscriber! Anonymous user gifted `{display_name}` a sub to `{chan}`! (Gift Count: `{gift_count}`)"
    );

    if let Err(e) = chann_id.say(&http_client, msg).await {
        return Err(format!("{e:?}"));
    }
    Ok(())
}
