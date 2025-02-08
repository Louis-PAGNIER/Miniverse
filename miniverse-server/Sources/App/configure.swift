import Vapor
import Fluent
import FluentSQLiteDriver

// configures your application
public func configure(_ app: Application) async throws {
    // uncomment to serve files from /Public folder
    // app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
    app.databases.use(.sqlite(.file("Data/db.sqlite")), as: .sqlite)
    app.migrations.add(CreateUser())
    try await app.autoMigrate()
    // register routes
    try routes(app)
}
