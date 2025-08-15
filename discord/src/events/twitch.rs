use poise::serenity_prelude::{self as serenity, futures::StreamExt};
use redis::RedisResult;
use serde::{Deserialize, Serialize};
use serde_json::Value;

mod message;

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum TwitchEventData {
    AnonGiftPaidUpdate {
        channel: String,
        userstate: Value,
        #[serde(rename = "giftCount")]
        gift_count: u32,
    },
    Cheer {
        channel: String,
        userstate: Value,
        message: String,
    },
    Message {
        channel: String,
        tags: Value,
        message: Option<String>,
        #[serde(rename = "self")]
        is_self: bool,
    },
    Raided {
        channel: String,
        username: String,
        viewers: u32,
    },
    Resub {
        channel: String,
        username: String,
        months: u32,
        message: Option<String>,
        userstate: Value,
    },
    SubGift {
        channel: String,
        username: String,
        #[serde(rename = "streakMonths")]
        streak_months: Option<u32>,
        recipient: String,
        tags: Value,
    },
    Subscription {
        channel: String,
        username: String,
        methods: Value,
        message: Option<String>,
        tags: Value,
    },
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TwitchEvent {
    #[serde(rename = "eventType")]
    pub event_type: String,
    pub data: TwitchEventData,
}

pub async fn start_redis_listener(http_client: serenity::Http, redis_url: &str) -> RedisResult<()> {
    let client = redis::Client::open(redis_url)?;
    let mut conn = client.get_async_pubsub().await?;

    conn.subscribe("twitch_events").await?;
    let mut pubsub_stream = conn.on_message();

    println!("Listening for Redis messages on 'twitch_events' channel...");

    while let Some(msg) = pubsub_stream.next().await {
        let payload: String = msg.get_payload()?;
        println!("[Redis Listener] Received message: {payload}");

        if let Ok(event) = serde_json::from_str::<TwitchEvent>(&payload) {
            println!("[Redis Listener] Parsed Event: {event:?}");

            match event.event_type.as_str() {
                "anongiftpaidupdate" => {
                    println!("Anon gift paid detected");
                }
                "cheer" => {
                    println!("Cheer detected");
                }
                "message" => {
                    let _ = message::message_event(&http_client, event).await;
                }
                "raided" => {
                    println!("Raid detected");
                }
                "resub" => {
                    println!("Resub detected");
                }
                "subgift" => {
                    println!("Subgift detected");
                }
                "subscription" => {
                    println!("Subscription detected");
                }
                _ => {
                    println!("Unknown event detected");
                }
            }
        } else {
            eprintln!("[Redis Listener] Failed to parse JSON: {payload}");
        }
    }

    Ok(())
}
