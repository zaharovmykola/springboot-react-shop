package org.mykola.zakharov.springboot.react.market.internet.market.dao;

import org.mykola.zakharov.springboot.react.market.internet.market.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CartMongoDAO extends MongoRepository<Cart, String> {
    Cart findCartByUserId(Long userId);
}
