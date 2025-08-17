use super::TwitchEvent;
use crate::events::twitch::TwitchEventData;
use poise::serenity_prelude::{self as serenity, ChannelId};

pub async fn resub_event(http_client: &serenity::Http, event: TwitchEvent) -> Result<(), String> {
    let chan;
    let username;
    let message;
    let mut userstate;

    match event.data {
        TwitchEventData::Resub {
            channel: c,
            username: un,
            months: _,
            message: me,
            userstate: us,
        } => {
            chan = c;
            username = un;
            message = me;
            userstate = us;
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

    let cm = userstate["msg-param-cumulative-months"].take();
    let cumulative_months = cm.as_str().unwrap_or("Error: No Cumulative Months");

    let msg = format!(
        "### ✨ Re-sub from `{username}`! This is their __{cumulative_months}__ month in a row subscribed to `{chan}`! \"`{}`\"",
        message.unwrap_or("".into())
    );

    if let Err(e) = chann_id.say(&http_client, msg).await {
        return Err(format!("{e:?}"));
    }
    Ok(())
}
