//
//  BaseMigrations.swift
//  miniverse-server
//
//  Created by Louis PAGNIER on 08/02/2025.
//

import Fluent

struct CreateUser: AsyncMigration {
    func prepare(on database: any Database) async throws {
        try await database.schema("users")
            .id()
            .field("username", .string)
            .field("password", .string)
            .create()
    }
    
    func revert(on database: any Database) async throws {
        try await database.schema("users").delete()
    }
}
