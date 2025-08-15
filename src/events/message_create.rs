use poise::serenity_prelude::Message;

pub async fn message_create(msg: Message) {
    let channel = std::env::var("DISCORD_CHANNEL_ID")
        .expect("Expected a TWITCH_BOT_USERNAME environment variable.");

    if msg.channel_id == channel.parse::<u64>().unwrap() {
        println!("Content: {}", msg.content);
    }
}
