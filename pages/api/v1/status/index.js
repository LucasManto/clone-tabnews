import database from "infra/database.js";

async function status(request, response) {
	const updatedAt = new Date().toISOString();
	const databaseVersionQueryResult =
		await database.query(`SHOW server_version;`);
	const version = databaseVersionQueryResult.rows[0].server_version;

	const databaseMaxConnectionsQueryResult = await database.query(
		`SHOW max_connections;`,
	);
	const maxConnections =
		databaseMaxConnectionsQueryResult.rows[0].max_connections;

	const databaseName = process.env.POSTGRES_DB;
	const databaseOpenedConnectionsQueryResult = await database.query({
		text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1`,
		values: [databaseName],
	});
	const openedConnections = databaseOpenedConnectionsQueryResult.rows[0].count;

	response.status(200).json({
		updated_at: updatedAt,
		dependencies: {
			database: {
				version,
				max_connections: parseInt(maxConnections),
				opened_connections: openedConnections,
			},
		},
	});
}

export default status;
