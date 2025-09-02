import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
	await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
	test("send", async () => {
		await orchestrator.deleteAllEmails();

		await email.send({
			from: "Sender <sender@example.com>",
			to: "receiver@example.com",
			subject: "Test subject",
			text: "Test body.",
		});

		await email.send({
			from: "Sender <sender@example.com>",
			to: "receiver@example.com",
			subject: "Last sent e-mail",
			text: "Last e-mail body.",
		});

		const lastEmail = await orchestrator.getLastEmail();
		expect(lastEmail.sender).toBe("<sender@example.com>");
		expect(lastEmail.recipients[0]).toBe("<receiver@example.com>");
		expect(lastEmail.subject).toBe("Last sent e-mail");
		expect(lastEmail.text).toBe("Last e-mail body.\n");
	});
});
