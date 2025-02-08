import Vapor

func routes(_ app: Application) throws {
    app.get { req async in
        "It works! Ahah!"
    }

    app.get("hello", ":name") { req async -> String in
        let name = req.parameters.get("name")!
        return "Hello, world! \(name)"
    }.description("Says Hello!")
    
    let apiRoutes = app.grouped("api")
    try apiRoutes.register(collection: UsersController())
}
