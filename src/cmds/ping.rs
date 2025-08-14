use crate::{Context, Error};
use chrono::Utc;

#[poise::command(slash_command, prefix_command)]
pub async fn ping(ctx: Context<'_>) -> Result<(), Error> {
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
