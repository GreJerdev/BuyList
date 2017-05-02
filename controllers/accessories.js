module.exports = {

    createResponse: function createResponse(err, errorMessage, data) {
        var response = {'error':err,'errorMessge':errorMessage,'data':data};
        return response;

    }
}