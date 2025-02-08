//
//  User.swift
//  miniverse-server
//
//  Created by Louis PAGNIER on 08/02/2025.
//

import Fluent
import Vapor

final class User: Model, Content, @unchecked Sendable {
    static let schema = "users"
    
    @ID(key: .id)
    var id: UUID?
    
    @Field(key: "username")
    var username: String
    
    @Field(key: "password")
    var password: String
    
    init() { }
    
    init(id: UUID? = nil, username: String, password: String) {
        self.id = id
        self.username = username
        self.password = password
    }
    
    final class Public: Content, @unchecked Sendable {
        var id: UUID?
        var username: String
        
        init(id: UUID?, username: String) {
            self.id = id
            self.username = username
        }
    }
}

extension User {
    func toPublic() -> User.Public {
        return User.Public(id: id, username: username)
    }
}
