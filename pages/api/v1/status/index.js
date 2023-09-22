function status(request, response) {
	response.status(200).json({ key: "são acima da média" });
}

export default status;
