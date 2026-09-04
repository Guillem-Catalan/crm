import "@crm/env/load";

import { createAnthropic } from "@ai-sdk/anthropic";
import { onTelemetryProblem, syncVersion } from "@crm/telemetry";
import { defineAgent } from "eve";
import { logCapabilities } from "./lib/capabilities";

void logCapabilities();

onTelemetryProblem((message) => console.debug(`[telemetry] ${message}`));

void syncVersion();

const azure = createAnthropic({
	baseURL: process.env.AZURE_FOUNDRY_ENDPOINT,
	apiKey: process.env.AZURE_FOUNDRY_KEY!,
});

export default defineAgent({
	model: azure(process.env.AZURE_DEPLOYMENT_NAME || "claude-sonnet-4-6"),
	modelContextWindowTokens: 200_000,
	limits: {
		maxInputTokensPerSession: 500_000,
		maxOutputTokensPerSession: 50_000,
		sessionTimeoutMs: 30 * 24 * 60 * 60 * 1000,
	},
});
