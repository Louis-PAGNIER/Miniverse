//
//  UsersController.swift
//  miniverse-server
//
//  Created by Louis PAGNIER on 08/02/2025.
//

import Vapor

struct UsersController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let usersRoute = routes.grouped("users")
        
        usersRoute.get(use: index)
        usersRoute.post(use: create)
        
    }
    
    @Sendable func index(req: Request) async throws -> [User.Public] {
        try await User.query(on: req.db).all().map { $0.toPublic() }
    }
    
    @Sendable func create(req: Request) async throws -> User.Public {
        let user = try req.content.decode(User.self)
        user.password = try Bcrypt.hash(user.password)
        try await user.save(on: req.db)
        return user.toPublic()
    }
}
