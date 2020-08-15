package org.mykola.zakharov.springboot.react.market.internet.market.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Getter
public class Cart {

    private final List<CartItem> cartItems;

    public Cart() {
        cartItems = new ArrayList<>();
    }
}
